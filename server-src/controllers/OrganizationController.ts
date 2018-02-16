import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IOrganizationRepository} from '../repositories/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {IOrganization, OrganizationVm, Organization, OrganizationType} from '../models/Organization';
import {INewOrganizationParams} from '../models/requests/index.requests';
import {BaseController} from './BaseController';

@Route('organization')
export class OrganizationController extends BaseController {
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);

    /**
     *
     * @param {INewOrganizationParams} newOrganizationParams
     * @returns {Promise<OrganizationVm>}
     */
    @Post('create')
    @Tags('Organization')
    public async registerOrganization(@Body() newOrganizationParams: INewOrganizationParams): Promise<OrganizationVm> {
        const name: string = newOrganizationParams.name;
        const orgType: OrganizationType = newOrganizationParams.orgType ? newOrganizationParams.orgType : null;


        const existOrganization: IOrganization = await this._organizationRepository.getOrganizationByName(name);

        if (existOrganization instanceof MongoError) throw OrganizationController.resolveErrorResponse(existOrganization, existOrganization.message);
        if (existOrganization) throw OrganizationController.resolveErrorResponse(null, 'Organization already existed');

        console.log(OrganizationController);

        const newOrganization: IOrganization = new Organization();
        newOrganization.name = name;
        newOrganization.orgType = orgType;

        return await <OrganizationVm>this._organizationRepository.create(newOrganization);
    }

    @Get('getAll')
    @Tags('Organization')
    public async getAll(): Promise<OrganizationVm[]> {
        const result: OrganizationVm[] = await this._organizationRepository.getAll();
        return result;
    }

    @Put('{id}')
    @Tags('Organization')
    public async updateOrganization(@Path() id: string, @Body() newOrganizationParams: INewOrganizationParams): Promise<OrganizationVm> {
        const updateOrganization: IOrganization = new Organization();
        updateOrganization._id = id;
        updateOrganization.orgType = newOrganizationParams.orgType;
        updateOrganization.name = newOrganizationParams.name;

        const result: OrganizationVm = await this._organizationRepository.update(id, updateOrganization);
        return result;
    }

    @Delete('{id}')
    @Tags('Organization')
    public async deleteOrganization(@Path() id: string): Promise<OrganizationVm> {
        const result: OrganizationVm = await this._organizationRepository.delete(id);
        return result;
    }
}


