import {IHarvesterRepository} from './interfaces/IHarvesterRepository';
import {HarvesterModel, IHarvester} from '../models/Harvester';
import {BaseRepository} from './BaseRepository';

export class HarvesterRepository extends BaseRepository<IHarvester> implements IHarvesterRepository {
    private _harvesterModel: HarvesterModel;

    constructor(harvesterModel: HarvesterModel) {
        super(harvesterModel);
        this._harvesterModel = harvesterModel;
    }
}