import {Body, Get, Path, Post, Query, Route, Tags} from 'tsoa';
import {IHarvestRepository} from '../repositories/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';
import {Harvest, IHarvest, IHarvestVm} from '../models/Harvest';
import {IHarvestParams} from '../models/requests/index.requests';
import {Entry} from '../models/Entry';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {BaseController} from './BaseController';
import moment = require('moment');
import { IFarm, Farm } from '../models/Farm';
import { IFarmRepository } from '../repositories/IFarmRepository';
import { FarmRepository } from '../repositories/FarmRepository';

@Route('harvests')
export class HarvestController extends BaseController {
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);

    /**
     * 
     * @param harvestParams 
     */
    @Post('create')
    @Tags('Harvest')
    public async registerHarvest(@Body() harvestParams: IHarvestParams): Promise<IHarvestVm> {

        if (!harvestParams.farmId) {
            throw HarvestController.resolveErrorResponse(null, 'FarmID is REQUIRED');
        }

        const newHarvest: IHarvest = new Harvest();
        const farm: IFarm = await this._farmRepository.getResourceById(harvestParams.farmId);
        newHarvest.farm = farm;

        if ((harvestParams.entriesIds && harvestParams.entriesIds.length > 0) && harvestParams.harvestId) {
            const existedHarvest: IHarvest = await this._harvestRepository.getResourceById(harvestParams.harvestId);

            const updatedHarvest: IHarvest = new Harvest();
            updatedHarvest._id = existedHarvest._id;
            updatedHarvest.createdOn = existedHarvest.createdOn;
            updatedHarvest.updatedOn = moment().toDate();
            updatedHarvest.farm = existedHarvest.farm;
            updatedHarvest.entries = await this._entryRepository.getResourcesByIds(harvestParams.entriesIds);

            return await <IHarvestVm>this._harvestRepository.update(harvestParams.harvestId, updatedHarvest);
        } else {
            return await <IHarvestVm>this._harvestRepository.create(newHarvest);
        }
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IHarvestVm[]>}
     */
    @Get('getAll')
    @Tags('Harvest')
    public async getAll(): Promise<IHarvestVm[]> {
        return await <IHarvestVm[]>this._harvestRepository.getAll();
    }

    // @Get('getQuery')
    // @Tags('Harvest')
    // public async getByDate(@Query() date: Date): Promise<IHarvestVm[]> {
    //     return await <IHarvestVm[]>this._harvestRepository.findByDate(date);
    // }

    @Get('{id}')
    @Tags('Harvest')
    public async getHarvestById(@Path() id: string): Promise<IHarvestVm> {
        return await <IHarvestVm>this._harvestRepository.getResourceById(id);
    }
}