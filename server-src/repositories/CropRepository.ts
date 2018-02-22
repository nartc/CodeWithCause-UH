import {ICropRepository} from './interfaces/ICropRepository';
import {CropModel, ICrop} from '../models/Crop';
import {BaseRepository} from './BaseRepository';

export class CropRepository extends BaseRepository<ICrop> implements ICropRepository {

    private _cropModel: CropModel;

    constructor(cropModel: CropModel) {
        super(cropModel);
        this._cropModel = cropModel;
    }
}