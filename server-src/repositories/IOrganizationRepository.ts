import {IOrganization} from '../models/organization';

export interface IOrganizationRepository {
    createOrganization(newOrganization: IOrganization);

    getOrganizationByName(name: string);

    updateOrganization(id: string, updatedOrganization: IOrganization); 

    getAllOrganization();
}