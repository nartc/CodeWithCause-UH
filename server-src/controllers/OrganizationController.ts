import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IOrganizationRepository} from '../repositories/interfaces/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {IOrganization, OrganizationVm, Organization, OrganizationType} from '../models/Organization';
import {NewOrganizationParams} from '../models/requests/index.requests';
import {BaseController} from './BaseController';

@Route('organization')
export class OrganizationController extends BaseController {
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);

    /**
     *
     * @param {NewOrganizationParams} newOrganizationParams
     * @returns {Promise<OrganizationVm>}
     */
    @Post('create')
    @Tags('Organization')
    public async registerOrganization(@Body() newOrganizationParams: NewOrganizationParams): Promise<OrganizationVm> {
        const name: string = newOrganizationParams.name;
        const orgType: OrganizationType = newOrganizationParams.orgType ? newOrganizationParams.orgType : null;

        const existOrganization: IOrganization = await this._organizationRepository.getOrganizationByName(name);

        if (existOrganization instanceof MongoError) throw OrganizationController.resolveErrorResponse(existOrganization, existOrganization.message);
        if (existOrganization) throw OrganizationController.resolveErrorResponse(null, 'Organization already existed');

        const newOrganization: IOrganization = new Organization();
        newOrganization.name = name;
        newOrganization.orgType = orgType;

        return await this._organizationRepository.create(newOrganization) as OrganizationVm;
    }

    @Get('getAll')
    @Tags('Organization')
    public async getAll(): Promise<OrganizationVm[]> {
        return await this._organizationRepository.getAll();
    }

    @Put('{id}')
    @Tags('Organization')
    public async updateOrganization(@Path() id: string, @Body() newOrganizationParams: NewOrganizationParams): Promise<OrganizationVm> {
        const updateOrganization: IOrganization = new Organization();
        updateOrganization._id = id;
        updateOrganization.orgType = newOrganizationParams.orgType;
        updateOrganization.name = newOrganizationParams.name;

        return await this._organizationRepository.update(id, updateOrganization);
    }

    @Delete('{id}')
    @Tags('Organization')
    public async deleteOrganization(@Path() id: string): Promise<OrganizationVm> {
        return await this._organizationRepository.delete(id);
    }
}
