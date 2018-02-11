import {IHarvest} from '../models/Harvest';

export interface IHarvestRepository {
    createHarvest(crop: IHarvest);
    findAll();
    findByDate(date: Date);
    update(id: string, updatedHarvest: IHarvest);
    getHarvestById(id: string);
}