import {IOrganization} from '../../models/Organization';
import {IBaseRepository} from './IBaseRepository';

export interface IOrganizationRepository extends IBaseRepository<IOrganization> {
    getOrganizationByName(name: string);
}