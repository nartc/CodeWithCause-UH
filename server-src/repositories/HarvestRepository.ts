import {IHarvestRepository} from './IHarvestRepository';
import {HarvestModel, IHarvest} from '../models/Harvest';

export class HarvestRepository implements IHarvestRepository {
    private _harvestModel: HarvestModel;

    constructor(harvestModel: HarvestModel) {
        this._harvestModel = harvestModel;
    }

    public async createHarvest(newHarvest: IHarvest): Promise<IHarvest> {
        return await this._harvestModel.create(newHarvest);
    }

    public async findAll(): Promise<IHarvest[]> {
        return await this._harvestModel.find();
    }
}