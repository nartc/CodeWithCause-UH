import {IOrganizationRepository} from './interfaces/IOrganizationRepository';
import {IOrganization, OrganizationModel} from '../models/Organization';
import {BaseRepository} from './BaseRepository';

export class OrganizationRepository extends BaseRepository<IOrganization> implements IOrganizationRepository {

    private _organizationModel: OrganizationModel;

    constructor(organizationModel: OrganizationModel) {
        super(organizationModel);
        this._organizationModel = organizationModel;
    }

    public async getOrganizationByName(name: string): Promise<IOrganization> {
        const query = {name};
        return await this._organizationModel.findOne(query).exec();
    }
}