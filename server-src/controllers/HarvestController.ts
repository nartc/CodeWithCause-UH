import {Body, Controller, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IHarvestRepository} from '../repositories/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';
import {IHarvest, Harvest, IHarvestVm} from '../models/Harvest';
import {INewHarvestParams} from '../models/requests/index.requests';
import {genSalt, hash} from 'bcryptjs';
import {IEntry, Entry} from '../models/Entry';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';

@Route('harvests')
export class HarvestController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);
    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);

    /**
     *
     * @param {INewHarvestParams} newHarvestParams
     * @returns {Promise<IHarvestVm>}
     */
    @Post('create')
    @Tags('Harvest')
    public async registerHarvest(@Body() newHarvestParams: INewHarvestParams): Promise<IHarvestVm> {

        const newHarvest: IHarvest = new Harvest();
        newHarvest.farm = newHarvestParams.farm;

        newHarvestParams.entries.forEach(async (entry) => {
           const newEntry: IEntry = new Entry();
           newEntry.pounds = entry.pounds;

           const savedEntry: IEntry = await this._entryRepository.createEntry(newEntry);
           newHarvest.entries.push(savedEntry._id);
        });

        return await <IHarvestVm>this._harvestRepository.createHarvest(newHarvest);
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
}