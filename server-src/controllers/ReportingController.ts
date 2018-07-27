import {Body, Get, Post, Query, Route, Tags} from 'tsoa';
import {Entry, EntryVm} from '../models/Entry';
import {IOrganizationRepository} from '../repositories/interfaces/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {Organization, OrganizationType} from '../models/Organization';
import {IEntryRepository} from '../repositories/interfaces/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {IHarvestRepository} from '../repositories/interfaces/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';
import {Harvest, HarvestVm} from '../models/Harvest';
import {IFarmRepository} from '../repositories/interfaces/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm, FarmVm} from '../models/Farm';
import {PercentageReportResponse} from '../models/responses/PercentageReportResponse';
import {filter, map} from 'lodash';
import {BaseController} from './BaseController';
import {PercentageReportType} from '../models/requests/PercentageReportType';
import {WeightValueReportType} from '../models/requests/WeightValueReportType';
import {PercentageByFarm, ReportByFarm} from '../models/requests/ReportByFarm';
import {PercentageByFarmReportResponse, ValueReportResponse} from '../models/responses/ValueReportResponse';
import moment = require('moment');

@Route('reports')
export class ReportingController extends BaseController {
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);

    @Get('percentage')
    @Tags('Reporting')
    public async getSalesPercentage(@Query() percentageType: PercentageReportType): Promise<PercentageReportResponse> {
        const allEntries: EntryVm[] = await this._entryRepository.getAll() as EntryVm[];
        let queried: EntryVm[];

        if (percentageType === PercentageReportType.Donated) {
            queried = allEntries.filter((e) => e.recipient.orgType === OrganizationType.Donated || e.recipient.orgType === OrganizationType.Internal);
        } else if (percentageType === PercentageReportType.Purchased) {
            queried = allEntries.filter((e) => e.recipient.orgType === OrganizationType.Purchased);
        }

        const percentage: string = ((queried.length / allEntries.length) * 100).toFixed(2);
        return {
            createdOn: moment().toDate(),
            type: percentageType,
            percentage
        };
    };

    @Post('percentageByFarm')
    @Tags('Reporting')
    public async getPercentageByFarm(@Body() percentageByFarmParams: PercentageByFarm): Promise<PercentageByFarmReportResponse[]> {
        const result: PercentageByFarmReportResponse[] = [];
        let allHarvests: HarvestVm[];
        const {reportType, dateRange} = percentageByFarmParams;

        allHarvests = dateRange && dateRange.length > 0
            ? await this._harvestRepository.getHarvestByDateRange(dateRange) as HarvestVm[]
            : await this._harvestRepository.getAll() as HarvestVm[];

        const allFarms: FarmVm[] = await this._farmRepository.getAll() as FarmVm[];
        let donatedResult: PercentageByFarmReportResponse;
        let purchasedResult: PercentageByFarmReportResponse;
        let totalEntries = 0;
        let totalWeight = 0;
        let totalPrice = 0;

        if (reportType === PercentageReportType.Donated) {
            allHarvests.forEach((harvest) => {
                totalEntries += filter(harvest.entries, (entry) => entry.recipient.orgType === OrganizationType.Donated || entry.recipient.orgType === OrganizationType.Internal).length;
                const poundsArr = map(
                    filter(
                        harvest.entries,
                        (entry) => entry.recipient.orgType === OrganizationType.Donated || entry.recipient.orgType === OrganizationType.Internal),
                    (entry) => entry.pounds);
                const priceArr = map(
                    filter(
                        harvest.entries,
                        (entry) => entry.recipient.orgType === OrganizationType.Donated || entry.recipient.orgType === OrganizationType.Internal),
                    (entry) => entry.priceTotal);
                if (poundsArr && poundsArr.length > 0) {
                    totalWeight += poundsArr.reduce((cur, acc) => cur + acc);
                }

                if (priceArr && priceArr.length > 0) {
                    totalPrice += priceArr.reduce((cur, acc) => cur + acc);
                }
            });

            allFarms.forEach((farm) => {
                const queriedHarvests: HarvestVm[] = filter(allHarvests, (harvest) => harvest.farm.name === farm.name);
                let totalFarmWeight = 0;
                let totalFarmPrice = 0;
                let totalDonatedEntries = 0;
                queriedHarvests.forEach((harvest) => {
                    harvest.entries.forEach((entry) => {
                        if (entry.recipient.orgType === OrganizationType.Donated || entry.recipient.orgType === OrganizationType.Internal) {
                            totalFarmWeight += entry.pounds;
                            totalFarmPrice += entry.priceTotal;
                            totalDonatedEntries++;
                        }
                    });
                });
                donatedResult = {
                    farmName: farm.name,
                    pounds: totalFarmWeight,
                    total: totalFarmPrice,
                    percentageByEntry: ((totalDonatedEntries / totalEntries) * 100).toFixed(2),
                    percentageByPound: ((totalFarmWeight / totalWeight) * 100).toFixed(2),
                    percentageByPrice: ((totalFarmPrice / totalPrice) * 100).toFixed(2)
                };
                result.push(donatedResult);
            });
        } else if (reportType === PercentageReportType.Purchased) {
            allHarvests.forEach((harvest) => {
                totalEntries += filter(harvest.entries, (entry) => entry.recipient.orgType === OrganizationType.Purchased).length;
                const poundsArr = map(filter(harvest.entries, (entry) => entry.recipient.orgType === OrganizationType.Purchased), (entry) => entry.pounds);
                const priceArr = map(filter(harvest.entries, (entry) => entry.recipient.orgType === OrganizationType.Purchased), (entry) => entry.priceTotal);
                if (poundsArr && poundsArr.length > 0) {
                    totalWeight += poundsArr.reduce((cur, acc) => cur + acc);
                }

                if (priceArr && priceArr.length > 0) {
                    totalPrice += priceArr.reduce((cur, acc) => cur + acc);
                }
            });

            allFarms.forEach((farm) => {
                const queriedHarvests: HarvestVm[] = filter(allHarvests, (harvest) => harvest.farm.name === farm.name);
                let totalFarmWeight = 0;
                let totalFarmPrice = 0;
                let totalPurchasedEntries = 0;
                queriedHarvests.forEach((harvest) => {
                    harvest.entries.forEach((entry) => {
                        if (entry.recipient.orgType === OrganizationType.Purchased) {
                            totalFarmWeight += entry.pounds;
                            totalFarmPrice += entry.priceTotal;
                            totalPurchasedEntries++;
                        }
                    });
                });
                purchasedResult = {
                    farmName: farm.name,
                    pounds: totalFarmWeight,
                    total: totalFarmPrice,
                    percentageByEntry: ((totalPurchasedEntries / totalEntries) * 100).toFixed(2),
                    percentageByPound: ((totalFarmWeight / totalWeight) * 100).toFixed(2),
                    percentageByPrice: ((totalFarmPrice / totalPrice) * 100).toFixed(2)
                };
                result.push(purchasedResult);
            });
        }

        return result;
    }

    @Post('total')
    @Tags('Reporting')
    public async getTotalWeightOrValue(@Body() reportParams: ReportByFarm): Promise<ValueReportResponse[]> {
        let allHarvests: HarvestVm[];

        allHarvests = reportParams.dateRange && reportParams.dateRange.length > 0
            ? await this._harvestRepository.getHarvestByDateRange(reportParams.dateRange) as HarvestVm[]
            : await this._harvestRepository.getAll() as HarvestVm[];

        const allFarms: FarmVm[] = await this._farmRepository.getAll() as FarmVm[];
        let farmWeightResults: ValueReportResponse;
        let farmValueResult: ValueReportResponse;
        const result: ValueReportResponse[] = [];

        if (reportParams.valueReportType === WeightValueReportType.Weight) {
            allFarms.forEach((f) => {
                const queried: HarvestVm[] = filter(allHarvests, (h) => h.farm.name === f.name);
                let totalWeight = 0;
                if (queried.length > 0) {
                    queried.forEach((element) => {
                        element.entries.forEach((e) => {
                            totalWeight += e.pounds;
                        });
                    });
                }
                farmWeightResults = {
                    farmName: f.name,
                    value: totalWeight
                };
                result.push(farmWeightResults);
            });
        } else if (reportParams.valueReportType === WeightValueReportType.Value) {
            allFarms.forEach((f) => {
                const queried: HarvestVm[] = allHarvests.filter((h) => h.farm.name === f.name);
                let totalValue = 0;
                queried.forEach((element) => {
                    element.entries.forEach((e) => {
                        totalValue += e.priceTotal;
                    });
                });
                farmValueResult = {
                    farmName: f.name,
                    value: totalValue
                };
                result.push(farmValueResult);
            });
        }

        return result;
    }
}
