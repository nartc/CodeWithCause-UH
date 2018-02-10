import {ICrop} from '../models/Crop';

export interface ICropRepository {
    createCrop(crop: ICrop);
    findAll();
    update(id: string, updatedCrop: ICrop);
    delete(id: string);
    getCropById(id: string);
}