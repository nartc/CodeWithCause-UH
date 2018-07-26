import {Body, Delete, Get, Path, Post, Put, Route, Security, Tags} from 'tsoa';
import {ICropRepository} from '../repositories/interfaces/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {Crop, CropVm, ICrop} from '../models/Crop';
import {NewCropParams} from '../models/requests/NewCropParams';
import {BaseController} from './BaseController';
import {IHarvestRepository} from '../repositories/interfaces/IHarvestRepository';
import {HarvestRepository} from '../repositories/HarvestRepository';
import {Harvest} from '../models/Harvest';
import moment = require('moment');

@Route('crops')
export class CropController extends BaseController {
    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _harvestRepository: IHarvestRepository = new HarvestRepository(Harvest);

    /**
     *
     * @param {NewCropParams} newCropParams
     * @returns {Promise<CropVm>}
     */
    @Post('create')
    @Tags('Crop')
    public async registerCrop(@Body() newCropParams: NewCropParams): Promise<CropVm> {

        const newCrop: ICrop = new Crop();
        newCrop.name = newCropParams.name;
        newCrop.variety = newCropParams.variety;
        newCrop.pricePerPound = newCropParams.pricePerPound;

        return await <CropVm>this._cropRepository.create(newCrop);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<CropVm>}
     */
    @Get('getAll')
    @Tags('Crop')
    public async getAll(): Promise<CropVm[]> {
        const result: ICrop[] = await this._cropRepository.getAll();
        return <CropVm[]>result;
    }

    @Get('{id}')
    @Tags('Crop')
    public async getSingleCrop(@Path() id: string): Promise<CropVm> {
        return await <CropVm>this._cropRepository.getResourceById(id);
    }

    @Put('{id}')
    @Tags('Crop')
    public async updateCrop(@Path() id: string, @Body() updateCropParams: NewCropParams): Promise<CropVm> {
        const existedCrop: ICrop = await this._cropRepository.getResourceById(id);

        const updatedCrop: ICrop = new Crop();
        updatedCrop._id = existedCrop._id;
        updatedCrop.updatedOn = moment().toDate();
        updatedCrop.name = updateCropParams.name;
        updatedCrop.pricePerPound = updateCropParams.pricePerPound;
        updatedCrop.variety = updateCropParams.variety;
        await this._harvestRepository.syncDataOnUpdate(id, 'crop');
        return await <CropVm>this._cropRepository.update(id, updatedCrop);
    }

    @Delete('{id}')
    @Tags('Crop')
    @Security('JWT')
    public async deleteCrop(@Path() id: string): Promise<CropVm> {
        return await <CropVm>this._cropRepository.delete(id);
    }
}