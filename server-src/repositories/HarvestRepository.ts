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
        return await this._harvestModel.find()
            .populate('farm')
            .populate('entries');
    }

    public async findByDate(date: Date): Promise<IHarvest[]> {
        const query = {createdOn: date};
        return await this._harvestModel.find(query)
            .populate('farm')
            .populate('entries');
    }

    public async getHarvestById(id: string): Promise<IHarvest> {
        return await this._harvestModel.findById(id)
            .populate('farm')
            .populate('entries');
    }

    public async update(id: string, updatedHarvest: IHarvest): Promise<IHarvest> {
        return await this._harvestModel.findByIdAndUpdate(id, updatedHarvest)
            .populate('farm')
            .populate('entries');
    }
}