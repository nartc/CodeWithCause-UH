import {Body, Delete, Get, Path, Post, Put, Route, Security, Tags} from 'tsoa';
import {IFarmRepository} from '../repositories/interfaces/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm, FarmVm, IFarm} from '../models/Farm';
import {NewFarmParams} from '../models/requests/NewFarmParams';
import {BaseController} from './BaseController';
import {Harvest, IHarvest} from '../models/Harvest';
import {IHarvestRepository} from '../repositories/interfaces/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';

@Route('farms')
export class FarmController extends BaseController {
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);

    /**
     *
     * @param {NewFarmParams} newFarmParams
     * @returns {Promise<FarmVm>}
     */
    @Post('create')
    @Tags('Farm')
    public async registerFarm(@Body() newFarmParams: NewFarmParams): Promise<FarmVm> {

        const newFarm: IFarm = new Farm();
        newFarm.name = newFarmParams.name;
        newFarm.lat = newFarmParams.lat;
        newFarm.lng = newFarmParams.lng;

        return await <FarmVm>this._farmRepository.create(newFarm);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<FarmVm>}
     */
    @Get('getAll')
    @Tags('Farm')
    public async getAll(): Promise<FarmVm[]> {
        const result: IFarm[] = await this._farmRepository.getAll();
        return <FarmVm[]>result;
    }

    /**
     *
     * @param id
     */
    @Delete('{id}')
    @Tags('Farm')
    @Security('JWT')
    public async deleteById(@Path() id: string): Promise<FarmVm[]> {
        const result: IFarm[] = await this._farmRepository.delete(id);
        return <FarmVm[]>result;
    }

    /**
     *
     * @param id
     * @param newFarmParams
     */
    @Put('{id}')
    @Tags('Farm')
    public async updateById(@Path() id: string, @Body() newFarmParams: NewFarmParams): Promise<FarmVm> {
        const harvest: IHarvest = await this._harvestRepository.getHarvestByFarmId(id);

        const updateFarm: IFarm = new Farm();
        updateFarm._id = id;
        updateFarm.name = newFarmParams.name;
        updateFarm.lat = newFarmParams.lat;
        updateFarm.lng = newFarmParams.lng;

        if (harvest) {
            harvest.farm = updateFarm;
            await harvest.save();
        }

        const result: IFarm = await this._farmRepository.update(id, updateFarm);
        return <FarmVm>result;
    }
}