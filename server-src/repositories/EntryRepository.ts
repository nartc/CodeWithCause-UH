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

    // public async getEntryByEntryname(entryname: string): Promise<IEntry> {
    //     const query = {entryname};
    //     return await this._entryModel.findOne(query);
    // }
    //
    // public async getEntryById(id: string): Promise<IEntry> {
    //     return await this._entryModel.findById(id);
    // }
    //
    // public async updateEntry(id: string, updatedEntry: IEntry): Promise<IEntry> {
    //     return await this._entryModel.findByIdAndUpdate(id, updatedEntry);
    // }
}