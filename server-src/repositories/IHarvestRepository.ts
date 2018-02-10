import {IHarvest} from '../models/Harvest';

export interface IHarvestRepository {
    createHarvest(crop: IHarvest);
    findAll();
}