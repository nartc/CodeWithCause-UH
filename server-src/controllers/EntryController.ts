import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {Entry, IEntry, EntryVm} from '../models/Entry';
import {INewEntryParams} from '../models/requests/index.requests';
import * as moment from 'moment';
import {Farm} from '../models/Farm';
import {IFarmRepository} from '../repositories/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {IOrganizationRepository} from '../repositories/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {IOrganization, Organization} from '../models/Organization';
import {BaseController} from './BaseController';
import {Crop, ICrop} from '../models/Crop';
import {ICropRepository} from '../repositories/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {Harvester, IHarvester} from '../models/Harvester';
import {IHarvesterRepository} from '../repositories/IHarvesterRepository';
import {HarvesterRepository} from '../repositories/HarvesterRepository';

@Route('entries')
export class EntryController extends BaseController {
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _harvesterRepository: IHarvesterRepository = new HarvesterRepository(Harvester);

    /**
     *
     * @param {INewEntryParams} newEntryParams
     * @returns {Promise<EntryVm>}
     */
    @Post('create')
    @Tags('Entry')
    public async registerEntry(@Body() newEntryParams: INewEntryParams): Promise<EntryVm> {
        if (!newEntryParams.cropId || !newEntryParams.harvesterId || !newEntryParams.recipientId) {
            throw EntryController.resolveErrorResponse(null, 'CropID, HarvesterID and RecipientID are REQUIRED');
        }

        const newEntry: IEntry = new Entry();
        const crop: ICrop = await this._cropRepository.getResourceById(newEntryParams.cropId);
        const harvester: IHarvester = await this._harvesterRepository.getResourceById(newEntryParams.harvesterId);
        const recipient: IOrganization = await this._organizationRepository.getResourceById(newEntryParams.recipientId);

        newEntry.crop = crop;
        newEntry.harvester = harvester;
        newEntry.recipient = recipient;
        newEntry.pounds = newEntryParams.pounds;
        newEntry.priceTotal = crop.pricePerPound * newEntryParams.pounds;
        newEntry.comments = newEntryParams.comments;
        newEntry.selectedVariety = newEntryParams.selectedVariety;

        return await <EntryVm>this._entryRepository.create(newEntry);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<EntryVm[]>}
     */
    @Get('getAll')
    @Tags('Entry')
    public async getAll(): Promise<EntryVm[]> {
        return await <EntryVm[]>this._entryRepository.getAll();
    }

    /**
     *
     * @param id
     */
    @Get('{id}')
    @Tags('Entry')
    public async getSingleEntry(@Path() id: string): Promise<EntryVm> {
        return await <EntryVm>this._entryRepository.getResourceById(id);
    }

    /**
     *
     * @param id
     * @param updatedEntryParams
     */
    @Put('{id}')
    @Tags('Entry')
    public async updateEntry(@Path() id: string, @Body() updatedEntryParams: INewEntryParams): Promise<EntryVm> {
        const existedEntry: IEntry = await this._entryRepository.getResourceById(id);

        const updatedEntry: IEntry = new Entry();
        updatedEntry._id = existedEntry._id;
        updatedEntry.crop = existedEntry.crop;
        updatedEntry.harvester = existedEntry.harvester;
        updatedEntry.recipient = existedEntry.recipient;
        updatedEntry.createdOn = existedEntry.createdOn;
        updatedEntry.updatedOn = moment().toDate();
        updatedEntry.comments = updatedEntryParams.comments;
        updatedEntry.pounds = updatedEntryParams.pounds;
        updatedEntry.priceTotal = existedEntry.crop.pricePerPound * updatedEntryParams.pounds;
        updatedEntry.selectedVariety = updatedEntryParams.selectedVariety;

        return await <EntryVm>this._entryRepository.update(id, updatedEntry);
    }

    /**
     *
     * @param id
     */
    @Delete('{id}')
    @Tags('Entry')
    public async deleteEntry(@Path() id: string): Promise<EntryVm> {
        return await <EntryVm>this._entryRepository.delete(id);
    }

    // @Get('weight')
    // @Tags('Entry')
    // public async getTotalWeight(@Query() totalWeightQuery: ITotalWeightQuery): Promise<TotalWeightReport[]> {
    //     const farmName: string = totalWeightQuery.farmName ? totalWeightQuery.farmName : null;
    //     const recipientName: string = totalWeightQuery.recipient ? totalWeightQuery.recipient : null;
    //
    //     const farm: FarmVm = await this._farmRepository.getFarmByUsername(farmName);
    //     const recipient: OrganizationVm = await this._organizationRepository.getOrganizationByName(recipientName);
    //
    //     const queried: EntryVm[] = await <EntryVm[]>this._entryRepository.findByQuery(farm._id, recipient._id);
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