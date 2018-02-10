import {IFarm} from '../models/Farm';

export interface IFarmRepository {
    createFarm(farm: IFarm);
    findAll();
}