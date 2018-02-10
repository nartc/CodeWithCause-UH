import {IFarm} from '../models/farm';

export interface IFarmRepository {
    createFarm(farm: IFarm);
    findAll();
}