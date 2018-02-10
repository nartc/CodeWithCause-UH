import {IEntryRepository} from './IEntryRepository';
import {IEntry, EntryModel} from '../models/Entry';

export class EntryRepository implements IEntryRepository {
    private _entryModel: EntryModel;

    constructor(entryModel: EntryModel) {
        this._entryModel = entryModel;
    }

    public async createEntry(newEntry: IEntry): Promise<any> {
        return await this._entryModel.create(newEntry);
    }

    public async findAll(): Promise<any> {
        return await this._entryModel.find();
    }
}