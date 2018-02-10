import {Body, Controller, Get, Path, Post, Route, Tags, Delete, Put} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IFarmRepository} from '../repositories/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {IFarm, Farm, IFarmVm} from '../models/Farm';
import {INewFarmParams} from '../models/requests/index.requests';

@Route('farms')
export class FarmController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);

    /**
     *
     * @param {INewFarmParams} newFarmParams
     * @returns {Promise<IFarmVm>}
     */
    @Post('create')
    @Tags('Farm')
    public async registerFarm(@Body() newFarmParams: INewFarmParams): Promise<IFarmVm> {

        const newFarm: IFarm = new Farm();
        newFarm.name = newFarmParams.name;
        newFarm.lat = newFarmParams.lat;
        newFarm.lng = newFarmParams.lng;

        return await <IFarmVm>this._farmRepository.createFarm(newFarm);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IFarmVm>}
     */
    @Get('getAll')
    @Tags('Farm')
    public async getAll(): Promise<IFarmVm[]> {
        const result: IFarm[] = await this._farmRepository.findAll();
        return <IFarmVm[]>result;
    }

    @Delete('{id}')
    @Tags('Farm')
    public async deleteById(@Path() id: string): Promise<IFarmVm[]> {
        const result: IFarm[] = await this._farmRepository.delete(id);
        return <IFarmVm[]>result;
    }

    @Put('{id}')
    @Tags('Farm')
    public async updateById(@Path() id: string, @Body() newFarmParams: INewFarmParams): Promise<IFarmVm> {
        const updateFarm: IFarm = new Farm();
        updateFarm._id = id;
        // updateFarm._id = newFarmParams.id;
        updateFarm.name = newFarmParams.name;
        updateFarm.lat = newFarmParams.lat;
        updateFarm.lng = newFarmParams.lng;

        const result: IFarm = await this._farmRepository.update(id, updateFarm);
        return <IFarmVm>result;
    }
}