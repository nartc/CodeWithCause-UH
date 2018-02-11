import {IOrganization} from '../models/Organization';

export interface IOrganizationRepository {
    createOrganization(newOrganization: IOrganization);

    getOrganizationByName(name: string);

    updateOrganization(id: string, updatedOrganization: IOrganization); 

    getAllOrganization();

    deleteOrganization(id:string);
}