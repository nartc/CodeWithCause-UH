import {IHarvestRepository} from './interfaces/IHarvestRepository';
import {HarvestModel, IHarvest} from '../models/Harvest';
import {BaseRepository} from './BaseRepository';
import * as moment from 'moment';

export class HarvestRepository extends BaseRepository<IHarvest> implements IHarvestRepository {
    private _harvestModel: HarvestModel;

    constructor(harvestModel: HarvestModel) {
        super(harvestModel);
        this._harvestModel = harvestModel;
    }

    async getHarvestByFarmId(farmId: string): Promise<IHarvest> {
        return this._harvestModel.findOne({'farm._id': farmId}).exec() as any;
    }

    async getHarvestByDateRange(dateRange: Date[]): Promise<IHarvest[]> {
        const [dateStart, dateEnd] = dateRange;
        return this._harvestModel.find({createdOn: {$gte: dateStart, $lte: dateEnd}}).exec() as any;
    }
}
