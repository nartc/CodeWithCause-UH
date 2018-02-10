import {IOrganizationRepository} from './IOrganizationRepository';
import {IOrganization, OrganizationModel} from '../models/organization';

export class OrganizationRepository implements IOrganizationRepository {

    private _organizationModel: OrganizationModel;

    constructor(organizationModel: OrganizationModel) {
        this._organizationModel = organizationModel;
    }

    public async createOrganization(newOrganization: IOrganization): Promise<IOrganization> {
        return await this._organizationModel.create(newOrganization);
    }

    public async getOrganizationByName(name: string): Promise<IOrganization> {
        const query = {name};
        return await this._organizationModel.findOne(query);
    }

    public async updateOrganization(id: string, updatedOrganization: IOrganization): Promise<IOrganization> {
        return await this._organizationModel.findByIdAndUpdate(id, updatedOrganization);
    }

    public async getAllOrganization(): Promise<IOrganization[]> {
        return await this._organizationModel.find();
    }

    public async deleteOrganization(id: string): Promise<IOrganization> {
        return await this._organizationModel.findByIdAndRemove(id);
    }

}