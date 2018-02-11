import {IEntryRepository} from './IEntryRepository';
import {EntryModel, IEntry} from '../models/Entry';

export class EntryRepository implements IEntryRepository {
    private _entryModel: EntryModel;

    constructor(entryModel: EntryModel) {
        this._entryModel = entryModel;
    }

    public async createEntry(newEntry: IEntry): Promise<IEntry> {
        return await this._entryModel.create(newEntry);
    }

    public async findAll(): Promise<IEntry[]> {
        return await this._entryModel.find().populate('farm').populate('harvester').populate('recipient');
    }

    public async getEntryById(id: string): Promise<IEntry> {
        return await this._entryModel.findById(id)
            .populate('crop')
            .populate('harvester')
            .populate('recipient');
    }

    public async update(id: string, updatedEntry: IEntry): Promise<IEntry> {
        return await this._entryModel.findByIdAndUpdate(id, updatedEntry, {new: true});
    }

    public async delete(id: string): Promise<IEntry> {
        return await this._entryModel.findByIdAndRemove(id);
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