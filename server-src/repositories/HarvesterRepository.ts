import {IHarvesterRepository} from './IHarvesterRepository';
import {IHarvester, HarvesterModel} from '../models/Harvester';

export class HarvesterRepository implements IHarvesterRepository {
    private _harvesterModel: HarvesterModel;

    constructor(harvesterModel: HarvesterModel) {
        this._harvesterModel = harvesterModel;
    }

    public async createHarvester(newHarvester: IHarvester): Promise<any> {
        return await this._harvesterModel.create(newHarvester);
    }

    public async findAll(): Promise<any> {
        return await this._harvesterModel.find();
    }
}