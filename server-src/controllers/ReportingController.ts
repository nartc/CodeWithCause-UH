import {Get, Query, Route, Tags} from 'tsoa';
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
import moment = require('moment');

@Route('reports')
export class ReportingController extends BaseController {
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);


    @Get('percentage')
    @Tags('Reporting')
    public async getSalesPercentage(@Query() percentageType: string): Promise<PercentageReportResponse> {
        const allEntries: EntryVm[] = await <EntryVm[]>this._entryRepository.getAll();
        let queried: EntryVm[];

        if (percentageType === 'donated') {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Donated || e.recipient.orgType === OrganizationType.Internal);
        } else if (percentageType === 'purchased') {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Purchased);
        }

        const percentage: string = ((queried.length / allEntries.length) * 100).toFixed(2);

        return <PercentageReportResponse>{
            createdOn: moment().toDate(),
            type: percentageType,
            percentage
        }
    };

    @Get('total')
    @Tags('Reporting')
    public async getTotalWeightOrValue(@Query() weightOrValue: string): Promise<any> {
        const allHarvests: HarvestVm[] = await <HarvestVm[]>this._harvestRepository.getAll();
        const allFarms: FarmVm[] = await <FarmVm[]>this._farmRepository.getAll();
        let farmWeightResults = {};
        let farmValueResult = {};
        let result;

        if (weightOrValue === 'weight') {
            allFarms.forEach(f => { //farm: ChauFarm
                const queried: HarvestVm[] = filter(allHarvests, h => h.farm.name === f.name);
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
            allFarms.forEach(f => { //farm: ChauFarm
                const queried: HarvestVm[] = allHarvests.filter(h => h.farm.name === f.name);
                let totalValue = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        totalValue += e.priceTotal;
                    });
                });
                farmValueResult[f.name] = totalValue;
            });
            result = farmValueResult;
        }

        return result;
    }
}
