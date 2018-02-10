import {IHarvester} from '../models/harvester';

export interface IHarvesterRepository {
    createHarvester(harvester: IHarvester);
    findAll();
}