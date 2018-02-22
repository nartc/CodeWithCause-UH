import {IFarm} from '../../models/Farm';
import {IBaseRepository} from './IBaseRepository';

export interface IFarmRepository extends IBaseRepository<IFarm> {
    getFarmByUsername(farmName: string);
}