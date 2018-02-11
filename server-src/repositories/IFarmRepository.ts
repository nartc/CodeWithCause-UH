import {IFarm} from '../models/Farm';

export interface IFarmRepository {
    createFarm(farm: IFarm);
    findAll();
    update(id: string, newFarm: IFarm);
    delete(slug: string);
    getFarmById(id: string);
    getFarmByUsername(farmName: string);
}