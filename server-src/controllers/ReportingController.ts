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
import {filter} from 'lodash';
import {BaseController} from './BaseController';
import {PercentageReportType} from '../models/requests/PercentageReportType';
import {WeightValueReportType} from '../models/requests/WeightValueReportType';
import {ReportByFarm} from '../models/requests/ReportByFarm';
import {ValueReportResponse} from '../models/responses/ValueReportResponse';
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
        const allEntries: EntryVm[] = await <EntryVm[]>this._entryRepository.getAll();
        let queried: EntryVm[];

        if (percentageType === PercentageReportType.Donated) {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Donated || e.recipient.orgType === OrganizationType.Internal);
        } else if (percentageType === PercentageReportType.Purchased) {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Purchased);
        }

        const percentage: string = ((queried.length / allEntries.length) * 100).toFixed(2);

        return <PercentageReportResponse>{
            createdOn: moment().toDate(),
            type: percentageType,
            percentage
        }
    };

    @Post('total')
    @Tags('Reporting')
    public async getTotalWeightOrValue(@Body() reportParams: ReportByFarm): Promise<ValueReportResponse[]> {
        let allHarvests: HarvestVm[];

        if (reportParams.dateRange && reportParams.dateRange.length > 0) {
            allHarvests = await <HarvestVm[]> this._harvestRepository.getHarvestByDateRange(reportParams.dateRange);
        } else {
            allHarvests = await <HarvestVm[]>this._harvestRepository.getAll();
        }

        const allFarms: FarmVm[] = await <FarmVm[]>this._farmRepository.getAll();
        let farmWeightResults: ValueReportResponse;
        let farmValueResult: ValueReportResponse;
        let result: ValueReportResponse[] = [];

        if (reportParams.valueReportType === WeightValueReportType.Weight) {
            console.log('in Weight');
            allFarms.forEach(f => { //farm: ChauFarm
                console.log('farms', f);
                const queried: HarvestVm[] = filter(allHarvests, h => h.farm.name === f.name);
                let totalWeight = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        console.log('entries', e);
                        totalWeight += e.pounds;
                    });
                });
                farmWeightResults.farmName = f.name;
                farmWeightResults.value = totalWeight;
                console.log('farmresult', farmWeightResults);
                result.push(farmWeightResults);
            });
        } else if (reportParams.valueReportType === WeightValueReportType.Value) {
            allFarms.forEach(f => { //farm: ChauFarm
                const queried: HarvestVm[] = allHarvests.filter(h => h.farm.name === f.name);
                let totalValue = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        totalValue += e.priceTotal;
                    });
                });
                farmValueResult.farmName = f.name;
                farmValueResult.value = totalValue;
                result.push(farmValueResult);
            });
        }

        return result;
    }

    @Get('test')
    @Tags('Reporting')
    public async getTest(@Query() dateStart: Date, @Query() dateEnd: Date): Promise<HarvestVm[]> {
        return await this._harvestRepository.getHarvestByDateRange([dateStart, dateEnd]);
    }

    //
    // @Get('weightByFarm')
    // @Tags('Reporting')
    // public async reportWeightByFarm(@Body() reportWeightParams: ReportWeightByFarm): Promise<>
}
