import {EntryModel, IEntry} from '../models/Entry';
import {BaseRepository} from './BaseRepository';
import {IEntryRepository} from './interfaces/IEntryRepository';

export class EntryRepository extends BaseRepository<IEntry> implements IEntryRepository {
    private _entryModel: EntryModel;

    constructor(entryModel: EntryModel) {
        super(entryModel);
        this._entryModel = entryModel;
    }

    public async findByQuery(crop?: string, recipient?: string, harvester?: string): Promise<IEntry[]> {
        let query;
        if (!crop && recipient && !harvester) {
            query = {recipient};
        } else if (!recipient && crop && !harvester) {
            query = {crop};
        } else if (!crop && !recipient && harvester) {
            query = {harvester};
        } else if (crop && recipient && !harvester) {
            query = {$and: [{crop}, {recipient}]};
        } else if (crop && !recipient && harvester) {
            query = {$and: [{crop}, {harvester}]};
        } else if (!crop && recipient && harvester) {
            query = {$and: [{harvester}, {recipient}]};
        } else if (recipient && crop && harvester) {
            query = {$and: [{recipient}, {crop}, {harvester}]};
        }
        return await this._entryModel.find(query).exec();
    }

    public async updateMany(filter: any = {}, docs: any, options: any = {}) {
        return this._entryModel.updateMany(filter, docs, options).exec();
    }
}
