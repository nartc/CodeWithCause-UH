import {IEntry} from '../models/Entry';
import {IBaseRepository} from './IBaseRepository';

export interface IEntryRepository extends IBaseRepository<IEntry> {
    findAll();
    getEntryById(id: string);
    findByQuery(farm?: string, recipient?: string);
}