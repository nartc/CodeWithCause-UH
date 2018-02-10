import {ICropRepository} from './ICropRepository';
import {ICrop, CropModel} from '../models/Crop';

export class CropRepository implements ICropRepository {
    private _cropModel: CropModel;

    constructor(cropModel: CropModel) {
        this._cropModel = cropModel;
    }

    public async createCrop(newCrop: ICrop): Promise<any> {
        return await this._cropModel.create(newCrop);
    }

    public async findAll(): Promise<any> {
        return await this._cropModel.find();
    }
}