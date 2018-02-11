import {IEntry} from '../models/Entry';

export interface IEntryRepository {
    createEntry(entry: IEntry);
    findAll();
    getEntryById(id: string);
    update(id: string, updatedEntry: IEntry);
    delete(id: string);
    findByQuery(farm?: string, recipient?: string);
}