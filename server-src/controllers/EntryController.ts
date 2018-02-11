import {Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {Entry, IEntry, IEntryVm} from '../models/Entry';
import {INewEntryParams} from '../models/requests/index.requests';
import * as moment from 'moment';
import {ITotalWeightQuery} from '../models/requests/ITotalWeightQuery';
import {ITotalWeightReport} from '../models/responses/ITotalWeightReport';
import {Farm, IFarmVm} from '../models/Farm';
import {IFarmRepository} from '../repositories/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {IOrganizationRepository} from '../repositories/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {IOrganizationVm, Organization} from '../models/Organization';

@Route('entries')
export class EntryController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);

    /**
     *
     * @param {INewEntryParams} newEntryParams
     * @returns {Promise<IEntryVm>}
     */
    @Post('create')
    @Tags('Entry')
    public async registerEntry(@Body() newEntryParams: INewEntryParams): Promise<IEntryVm> {
        const newEntry: IEntry = new Entry();
        newEntry.crop = newEntryParams.crop;
        newEntry.pounds = newEntryParams.pounds;
        newEntry.priceTotal = newEntryParams.priceTotal;
        newEntry.comments = newEntryParams.comments;
        newEntry.harvester = newEntryParams.harvester;
        newEntry.recipient = newEntryParams.recipient;

        return await <IEntryVm>this._entryRepository.createEntry(newEntry);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IEntryVm[]>}
     */
    @Get('getAll')
    @Tags('Entry')
    public async getAll(): Promise<IEntryVm[]> {
        return await <IEntryVm[]>this._entryRepository.findAll();
    }

    @Get('{id}')
    @Tags('Entry')
    public async getSingleEntry(@Path() id: string): Promise<IEntryVm> {
        return await <IEntryVm>this._entryRepository.getEntryById(id);
    }

    @Put('{id}')
    @Tags('Entry')
    public async updateEntry(@Path() id: string, @Body() updatedEntryParams: INewEntryParams): Promise<IEntryVm> {
        const existedEntry: IEntry = await this._entryRepository.getEntryById(id);

        const updatedEntry: IEntry = new Entry();
        updatedEntry._id = existedEntry._id;
        updatedEntry.comments = updatedEntryParams.comments;
        updatedEntry.crop = updatedEntryParams.crop;
        updatedEntry.harvester = updatedEntryParams.harvester;
        updatedEntry.pounds = updatedEntryParams.pounds;
        updatedEntry.recipient = updatedEntryParams.recipient;
        updatedEntry.priceTotal = updatedEntryParams.priceTotal;
        updatedEntry.selectedVariety = updatedEntryParams.selectedVariety;
        updatedEntry.updatedOn = moment().toDate();
        updatedEntry.createdOn = existedEntry.createdOn;

        return await <IEntryVm>this._entryRepository.update(id, updatedEntry);
    }

    @Delete('{id}')
    @Tags('Entry')
    public async deleteEntry(@Path() id: string): Promise<IEntryVm> {
        return await <IEntryVm>this._entryRepository.delete(id);
    }

    // @Get('weight')
    // @Tags('Entry')
    // public async getTotalWeight(@Query() totalWeightQuery: ITotalWeightQuery): Promise<ITotalWeightReport[]> {
    //     const farmName: string = totalWeightQuery.farmName ? totalWeightQuery.farmName : null;
    //     const recipientName: string = totalWeightQuery.recipient ? totalWeightQuery.recipient : null;
    //
    //     const farm: IFarmVm = await this._farmRepository.getFarmByUsername(farmName);
    //     const recipient: IOrganizationVm = await this._organizationRepository.getOrganizationByName(recipientName);
    //
    //     const queried: IEntryVm[] = await <IEntryVm[]>this._entryRepository.findByQuery(farm._id, recipient._id);
    //
    //     const result: ITotalWeightQuery[] = [];
    //     queried.forEach(query => {
    //        result.push({
    //            farm: query.farm,
    //
    //        });
    //     });
    // }
}