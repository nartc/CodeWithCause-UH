import {IHarvest} from '../models/harvest';

export interface IHarvestRepository {
    createHarvest(crop: IHarvest);
    findAll();
}