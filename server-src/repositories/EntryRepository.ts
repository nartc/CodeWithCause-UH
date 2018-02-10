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
}