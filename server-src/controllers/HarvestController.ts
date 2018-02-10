import {Body, Controller, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IHarvestRepository} from '../repositories/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';
import {IHarvest, Harvest, IHarvestVm} from '../models/Harvest';
import {INewHarvestParams} from '../models/requests/index.requests';
import {genSalt, hash} from 'bcryptjs';

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

    /**
     *
     * @param {INewHarvestParams} newHarvestParams
     * @returns {Promise<IHarvestVm>}
     */
    @Post('create')
    @Tags('Harvest')
    public async registerHarvest(@Body() newHarvestParams: INewHarvestParams): Promise<IHarvestVm> {

        const newHarvest: IHarvest = new Harvest();
        newHarvest.entries = newHarvestParams.entries;
        newHarvest.farm = newHarvestParams.farm;

        return await <IHarvestVm>this._harvestRepository.createHarvest(newHarvest);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IHarvestVm>}
     */
    @Get('getAll')
    @Tags('Harvest')
    public async getAll(): Promise<IHarvestVm> {
        const result: IHarvest = await this._harvestRepository.findAll();
        return <IHarvestVm>result;
    }
}