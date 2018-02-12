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

@Route('harvests')
export class HarvestController extends BaseController {
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);

    /**
     *
     * @param {IHarvestParams} harvestParams
     * @returns {Promise<IHarvestVm>}
     */
    @Post('create')
    @Tags('Harvest')
    public async registerHarvest(@Body() harvestParams: IHarvestParams): Promise<IHarvestVm> {

        const newHarvest: IHarvest = new Harvest();
        newHarvest.farm = harvestParams.farm;

        console.log(harvestParams.entries);

        if ((harvestParams.entries && harvestParams.entries.length > 0) && harvestParams.harvestId) {
            const existedHarvest: IHarvestVm = await <IHarvestVm>this._harvestRepository.getHarvestById(harvestParams.harvestId);

            const updatedHarvest: IHarvest = new Harvest();
            updatedHarvest._id = existedHarvest._id;
            updatedHarvest.entries = harvestParams.entries;
            updatedHarvest.createdOn = existedHarvest.createdOn;
            updatedHarvest.updatedOn = moment().toDate();
            updatedHarvest.farm = existedHarvest.farm._id;

            return await <IHarvestVm>this._harvestRepository.updateHarvest(harvestParams.harvestId, updatedHarvest);
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
        return await <IHarvestVm[]>this._harvestRepository.findAll();
    }

    @Get('getQuery')
    @Tags('Harvest')
    public async getByDate(@Query() date: Date): Promise<IHarvestVm[]> {
        return await <IHarvestVm[]>this._harvestRepository.findByDate(date);
    }

    @Get('{id}')
    @Tags('Harvest')
    public async getHarvestById(@Path() id: string): Promise<IHarvestVm> {
        return await <IHarvestVm>this._harvestRepository.getHarvestById(id);
    }
}