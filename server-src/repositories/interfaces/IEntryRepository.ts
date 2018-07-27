import {IEntry} from '../../models/Entry';
import {IBaseRepository} from './IBaseRepository';

export interface IEntryRepository extends IBaseRepository<IEntry> {
    findByQuery(crop?: string, recipient?: string, harvester?: string);
    updateMany(filter: any = {}, docs: any, options: any = {});
}
