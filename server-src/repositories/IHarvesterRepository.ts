import {IHarvester} from '../models/Harvester';

export interface IHarvesterRepository {
    createHarvester(harvester: IHarvester);
    findAll();
}