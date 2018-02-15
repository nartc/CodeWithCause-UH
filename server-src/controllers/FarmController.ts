import {Body, Delete, Get, Path, Post, Put, Route, Security, Tags} from 'tsoa';
import {IFarmRepository} from '../repositories/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm, IFarm, IFarmVm} from '../models/Farm';
import {INewFarmParams} from '../models/requests/index.requests';
import {BaseController} from './BaseController';

@Route('farms')
export class FarmController extends BaseController {
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

        return await <IFarmVm>this._farmRepository.create(newFarm);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IFarmVm>}
     */
    @Get('getAll')
    @Tags('Farm')
    public async getAll(): Promise<IFarmVm[]> {
        const result: IFarm[] = await this._farmRepository.getAll();
        return <IFarmVm[]>result;
    }

    /**
     * 
     * @param id 
     */
    @Delete('{id}')
    @Tags('Farm')
    @Security('JWT')
    public async deleteById(@Path() id: string): Promise<IFarmVm[]> {
        const result: IFarm[] = await this._farmRepository.delete(id);
        return <IFarmVm[]>result;
    }

    /**
     * 
     * @param id 
     * @param newFarmParams 
     */
    @Put('{id}')
    @Tags('Farm')
    public async updateById(@Path() id: string, @Body() newFarmParams: INewFarmParams): Promise<IFarmVm> {
        const updateFarm: IFarm = new Farm();
        updateFarm._id = id;
        updateFarm.name = newFarmParams.name;
        updateFarm.lat = newFarmParams.lat;
        updateFarm.lng = newFarmParams.lng;

        const result: IFarm = await this._farmRepository.update(id, updateFarm);
        return <IFarmVm>result;
    }
}