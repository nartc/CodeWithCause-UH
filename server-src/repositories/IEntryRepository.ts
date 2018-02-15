import {IEntry} from '../models/Entry';
import {IBaseRepository} from './IBaseRepository';

export interface IEntryRepository extends IBaseRepository<IEntry> {
    findByQuery(farm?: string, recipient?: string);
}