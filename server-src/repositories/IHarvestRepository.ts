import {IHarvest} from '../models/Harvest';
import {IBaseRepository} from './IBaseRepository';

export interface IHarvestRepository extends IBaseRepository<IHarvest> {
    findAll();
    findByDate(date: Date);
    updateHarvest(id: string, updatedHarvest: IHarvest);
    getHarvestById(id: string);
}