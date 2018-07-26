import {IHarvest} from '../../models/Harvest';
import {IBaseRepository} from './IBaseRepository';

export interface IHarvestRepository extends IBaseRepository<IHarvest> {
    getHarvestByFarmId(farmId: string);
    getHarvestByDateRange(dateRange: Date[]);
    syncDataOnUpdate(id: string, type?: 'harvester' | 'crop' | 'organization');
}
