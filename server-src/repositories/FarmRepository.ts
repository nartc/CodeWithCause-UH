import {IFarmRepository} from './IFarmRepository';
import {IFarm, FarmModel} from '../models/Farm';
import {BaseRepository} from './BaseRepository';

export class FarmRepository extends BaseRepository<IFarm> implements IFarmRepository {
    private _farmModel: FarmModel;

    constructor(farmModel: FarmModel) {
        super(farmModel);
        this._farmModel = farmModel;
    }

    public async getFarmByUsername(name: string): Promise<IFarm> {
        const query = {name};
        return await this._farmModel.findOne(query);
    }
}