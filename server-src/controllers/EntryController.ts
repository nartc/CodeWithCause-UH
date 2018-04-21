import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {IEntryRepository} from '../repositories/interfaces/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {Entry, EntryVm, IEntry} from '../models/Entry';
import {NewEntryParams} from '../models/requests/index.requests';
import {Farm} from '../models/Farm';
import {IFarmRepository} from '../repositories/interfaces/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {IOrganizationRepository} from '../repositories/interfaces/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {IOrganization, Organization} from '../models/Organization';
import {BaseController} from './BaseController';
import {Crop, ICrop} from '../models/Crop';
import {ICropRepository} from '../repositories/interfaces/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {Harvester, IHarvester} from '../models/Harvester';
import {IHarvesterRepository} from '../repositories/interfaces/IHarvesterRepository';
import {HarvesterRepository} from '../repositories/HarvesterRepository';
import {Harvest, HarvestVm, IHarvest} from '../models/Harvest';
import {IHarvestRepository} from '../repositories/interfaces/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';

@Route('entries')
export class EntryController extends BaseController {
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _harvesterRepository: IHarvesterRepository = new HarvesterRepository(Harvester);

    /**
     *
     * @param {NewEntryParams} newEntryParams
     * @returns {Promise<EntryVm>}
     */
    @Post('create')
    @Tags('Entry')
    public async registerEntry(@Body() newEntryParams: NewEntryParams): Promise<EntryVm> {
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
    @Put('{harvestId}')
    @Tags('Entry')
    public async updateEntry(@Path() harvestId: string, @Body() updatedEntryVm: EntryVm): Promise<HarvestVm> {
        const harvest: IHarvest = await this._harvestRepository.getResourceById(harvestId);

        if (!harvest)
            throw EntryController.resolveErrorResponse(null, `Harvest with ${harvestId} not found`);

        const updatedEntry: IEntry = new Entry(updatedEntryVm);
        updatedEntry.priceTotal = updatedEntry.crop.pricePerPound * updatedEntry.pounds;

        harvest.entries.splice(harvest.entries.findIndex(entry => entry._id === updatedEntry._id), 1, updatedEntry)
        const updatedHarvest: IHarvest = await harvest.save();
        await this._entryRepository.update(updatedEntry._id, updatedEntry);
        return <HarvestVm>updatedHarvest;
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
}