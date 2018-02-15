import {IHarvestRepository} from './IHarvestRepository';
import {HarvestModel, IHarvest} from '../models/Harvest';
import {BaseRepository} from './BaseRepository';

export class HarvestRepository extends BaseRepository<IHarvest> implements IHarvestRepository {
    private _harvestModel: HarvestModel;

    constructor(harvestModel: HarvestModel) {
        super(harvestModel);
        this._harvestModel = harvestModel;
    }
}