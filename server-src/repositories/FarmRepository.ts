import {IFarmRepository} from './IFarmRepository';
import {IFarm, FarmModel} from '../models/Farm';

export class FarmRepository implements IFarmRepository {
    private _cropModel: FarmModel;

    constructor(cropModel: FarmModel) {
        this._cropModel = cropModel;
    }

    public async createFarm(newFarm: IFarm): Promise<any> {
        return await this._cropModel.create(newFarm);
    }

    public async findAll(): Promise<any> {
        return await this._cropModel.find();
    }
}