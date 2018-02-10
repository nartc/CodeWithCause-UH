import {IFarmRepository} from './IFarmRepository';
import {IFarm, FarmModel} from '../models/Farm';

export class FarmRepository implements IFarmRepository {
    private _farmModel: FarmModel;

    constructor(farmModel: FarmModel) {
        this._farmModel = farmModel;
    }

    public async createFarm(newFarm: IFarm): Promise<IFarm> {
        return await this._farmModel.create(newFarm);
    }

    public async findAll(): Promise<IFarm[]> {
        return await this._farmModel.find();
    }

    public async delete(slug: string): Promise<any> {
        return await this._farmModel.findByIdAndRemove({_id:slug})
    }

    public async update(id: string, newFarm: IFarm): Promise<any> {
        return await this._farmModel.findByIdAndUpdate(id, newFarm, {new: true});
    }
}