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
        return this._harvestModel.findOne({'farm._id': farmId}).exec();
    }

    async getHarvestByDateRange(dateRange: [Date, Date]): Promise<IHarvest[]> {
        const [dateStart, dateEnd] = dateRange;
        return this._harvestModel.find({
            $and: [
                {createdOn: {$gte: moment(dateStart).toDate()}},
                {createdOn: {$lte: moment(dateEnd).toDate()}}
            ]
        }).exec();
    }
}