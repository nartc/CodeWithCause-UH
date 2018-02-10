import {IHarvesterRepository} from './IHarvesterRepository';
import {HarvesterModel, IHarvester} from '../models/Harvester';

export class HarvesterRepository implements IHarvesterRepository {
    private _harvesterModel: HarvesterModel;

    constructor(harvesterModel: HarvesterModel) {
        this._harvesterModel = harvesterModel;
    }

    public async createHarvester(newHarvester: IHarvester): Promise<IHarvester> {
        return await this._harvesterModel.create(newHarvester);
    }

    public async findAll(): Promise<IHarvester[]> {
        return await this._harvesterModel.find();
    }

    public async delete(id: string): Promise<IHarvester> {
        return await this._harvesterModel.findByIdAndRemove(id);
    }
}