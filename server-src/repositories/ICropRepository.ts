import {ICrop} from '../models/crop';

export interface ICropRepository {
    createCrop(crop: ICrop);
    findAll();
}