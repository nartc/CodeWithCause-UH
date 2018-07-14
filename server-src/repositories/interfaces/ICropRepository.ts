import {IBaseRepository} from './IBaseRepository';
import {ICrop} from '../../models/Crop';

export interface ICropRepository extends IBaseRepository<ICrop> {
    findByCrop(crop: string);
}
