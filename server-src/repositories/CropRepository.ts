import {ICropRepository} from './ICropRepository';
import {CropModel, ICrop} from '../models/Crop';

export class CropRepository implements ICropRepository {

    private _cropModel: CropModel;

    constructor(cropModel: CropModel) {
        this._cropModel = cropModel;
    }

    public async createCrop(newCrop: ICrop): Promise<ICrop> {
        return await this._cropModel.create(newCrop);
    }

    public async findAll(): Promise<ICrop[]> {
        return await this._cropModel.find();
    }

    public async update(id: string, updatedCrop: ICrop): Promise<ICrop> {
        return await this._cropModel.findByIdAndUpdate(id, updatedCrop);
    }

    public async delete(id: string) {
        return await this._cropModel.findByIdAndRemove(id);
    }

    public async getCropById(id: string) {
        return await this._cropModel.findById(id);
    }
}