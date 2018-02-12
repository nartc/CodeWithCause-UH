import {Get, Query, Route, Tags} from 'tsoa';
import {Entry, IEntryVm} from '../models/Entry';
import {IOrganizationRepository} from '../repositories/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {Organization, OrganizationType} from '../models/Organization';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {IHarvestRepository} from '../repositories/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';
import {Harvest, IHarvestVm} from '../models/Harvest';
import {IFarmRepository} from '../repositories/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm, IFarmVm} from '../models/Farm';
import {IPercentageReportResponse} from '../models/responses/IPercentageReportResponse';
import {filter} from 'lodash';
import {BaseController} from './BaseController';
import moment = require('moment');

@Route('reports')
export class ReportingController extends BaseController {
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);


    @Get('percentage')
    @Tags('Reporting')
    public async getSalesPercentage(@Query() percentageType: string): Promise<IPercentageReportResponse> {
        const allEntries: IEntryVm[] = await <IEntryVm[]>this._entryRepository.findAll();
        let queried: IEntryVm[];

        if (percentageType === 'donated') {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Donated || e.recipient.orgType === OrganizationType.Internal);
        } else if (percentageType === 'purchased') {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Purchased);
        }

        const percentage: string = ((queried.length / allEntries.length) * 100).toFixed(2);

        return <IPercentageReportResponse>{
            createdOn: moment().toDate(),
            type: percentageType,
            percentage
        }
    };

    @Get('total')
    @Tags('Reporting')
    public async getTotalWeightOrValue(@Query() weightOrValue: string): Promise<any> {
        const allHarvests: IHarvestVm[] = await <IHarvestVm[]>this._harvestRepository.findAll();
        const allFarms: IFarmVm[] = await <IFarmVm[]>this._farmRepository.getAll();
        let farmWeightResults = {};
        let farmValueResult = {};
        let result;

        if (weightOrValue === 'weight') {
            allFarms.forEach(f => { //farm: ChauFarm
                const queried: IHarvestVm[] = filter(allHarvests, h => h.farm.name === f.name);
                let totalWeight = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        totalWeight += e.pounds;
                    });
                });
                farmWeightResults[f.name] = totalWeight;
                result = farmWeightResults;
            });
        } else if (weightOrValue === 'value') {

            console.log(allHarvests);
            allFarms.forEach(f => { //farm: ChauFarm
                console.log(f);
                const queried: IHarvestVm[] = allHarvests.filter(h => h.farm.name === f.name);
                let totalValue = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        totalValue += e.priceTotal;
                    });
                });
                farmValueResult[f.name] = totalValue;
            });
            console.log(farmValueResult)
            result = farmValueResult;
        }

        return result;
    }
}
