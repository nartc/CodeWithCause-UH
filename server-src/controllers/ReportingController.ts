import {Controller, Get, Query, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
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
import moment = require('moment');

@Route('reports')
export class ReportingController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);


    @Get('percentage')
    @Tags('Reporting')
    public async getSalesPercentage(@Query() percentageType: string): Promise<any> {
        const allEntries: IEntryVm[] = await <IEntryVm[]>this._entryRepository.findAll();
        console.log(allEntries);
        let queried: IEntryVm[];

        if (percentageType === 'donated') {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Donated || e.recipient.orgType === OrganizationType.Internal);
        } else if (percentageType === 'purchased') {
            queried = await allEntries.filter(e => e.recipient.orgType === OrganizationType.Purchased);
        }

        const percentage: string = ((queried.length / allEntries.length) * 100).toFixed(2);

        return {
            createdOn: moment().toDate(),
            type: percentageType,
            percentage:percentage
        }
    };

    @Get('total')
    @Tags('Reporting')
    public async getTotalWeightOrValue(@Query() weightOrValue: string): Promise<any> {
        const allHarvests: IHarvestVm[] = await <IHarvestVm[]>this._harvestRepository.findAll();
        const allFarms: IFarmVm[] = await <IFarmVm[]>this._farmRepository.findAll();
        let farmWeightResults = {};
        let farmValueResult ={};
        console.log(allFarms);
        console.log(allHarvests);
        if (weightOrValue === 'weight') {
            console.log(allFarms);
            console.log(allHarvests);
            allFarms.forEach(f => { //farm: ChauFarm
                console.log(f);
                const queried: IHarvestVm[] = allHarvests.filter(h => h.farm._id === f._id);
                let totalWeight = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        totalWeight += e.pounds;
                    });
                });
                farmWeightResults[f.name] = totalWeight;
                console.log(farmWeightResults);
                return farmWeightResults;
            });
        }else if (weightOrValue === 'value'){

            console.log(allHarvests);
            allFarms.forEach(f => { //farm: ChauFarm
                console.log(f);
                const queried: IHarvestVm[] = allHarvests.filter(h => h.farm._id === f._id);
                let totalValue = 0;
                queried.forEach(element => {
                    element.entries.forEach(e => {
                        totalValue += e.priceTotal;
                    });
                });
                farmValueResult[f.name] = totalValue;
            });
            console.log(farmValueResult)
            return farmValueResult;
        }
        
         return null;
    }
}
