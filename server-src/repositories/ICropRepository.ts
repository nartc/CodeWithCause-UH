import {ICrop} from '../models/Crop';

export interface ICropRepository {
    createCrop(crop: ICrop);
    findAll();
}