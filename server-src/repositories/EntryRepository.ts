import {EntryModel, IEntry} from '../models/Entry';
import {BaseRepository} from './BaseRepository';
import {IEntryRepository} from './IEntryRepository';

export class EntryRepository extends BaseRepository<IEntry> implements IEntryRepository{
    private _entryModel: EntryModel;

    constructor(entryModel: EntryModel) {
        super(entryModel);
        this._entryModel = entryModel;
    }

    public async findAll(): Promise<IEntry[]> {
        return await this._entryModel.find()
            .populate('farm')
            .populate('harvester')
            .populate('recipient');
    }

    public async getEntryById(id: string): Promise<IEntry> {
        return await this._entryModel.findById(id)
            .populate('crop')
            .populate('harvester')
            .populate('recipient');
    }

    public async findByQuery(farm?: string, recipient?: string): Promise<IEntry[]> {
        let query;
        if (!farm && recipient) {
            query = {recipient};
        } else if (!recipient && farm) {
            query = {farm};
        } else if (recipient && farm) {
            query = {$and: [{recipient}, {farm}]};
        }

        return await this._entryModel.find(query)
            .populate('crop')
            .populate('harvester')
            .populate('recipient');
    }
}