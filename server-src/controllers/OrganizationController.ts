import { Body, Controller, Get, Path, Post, Route, Tags, Put, Delete } from 'tsoa';
import { MongoError } from 'mongodb';
import { IErrorResponse } from '../models/responses/index.responses';
import { IOrganizationRepository } from '../repositories/IOrganizationRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { IOrganization, IOrganizationVm, Organization } from '../models/organization';
import { INewOrganizationParams } from '../models/requests/index.requests';
import { genSalt, hash } from 'bcryptjs';

@Route('organization')
export class OrganizationController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);

    /**
     *
     * @param {INewOrganizationParams} newOrganizationParams
     * @returns {Promise<IOrganizationVm>}
     */
    @Post('create')
    @Tags('Organization')
    public async registerOrganization( @Body() newOrganizationParams: INewOrganizationParams): Promise<IOrganizationVm> {
        const contactName: string = newOrganizationParams.contactName
        const name: string = newOrganizationParams.name;
        const phoneNumber: number = newOrganizationParams.phoneNumber;
        const purchase: boolean = newOrganizationParams.purchase;


        const existOrganization: IOrganization = await this._organizationRepository.getOrganizationByName(name);

        if (existOrganization instanceof MongoError) throw OrganizationController.resolveErrorResponse(existOrganization, existOrganization.message);
        if (existOrganization) throw OrganizationController.resolveErrorResponse(null, 'Organization already existed');

        console.log(OrganizationController);

        const newOrganization: IOrganization = new Organization();


        return await <IOrganizationVm>this._organizationRepository.createOrganization(newOrganization);
    }

    @Get('getAll')
    @Tags('Organization')
    public async getAll(): Promise<IOrganizationVm[]> {
        const result: IOrganizationVm[] = await this._organizationRepository.getAllOrganization();
        return result;
    }

    @Put('{id}')
    @Tags('Organization')
    public async updateOrganization( @Path() id: string, @Body() newOrganizationParams: INewOrganizationParams): Promise<IOrganizationVm> {
        const updateOrganization: IOrganization = new Organization();
        updateOrganization._id = id;
        updateOrganization.purchase = newOrganizationParams.purchase;
        updateOrganization.phoneNumber = newOrganizationParams.phoneNumber;
        updateOrganization.contactName = newOrganizationParams.contactName;
        updateOrganization.name = newOrganizationParams.name;

        const result: IOrganizationVm = await this._organizationRepository.updateOrganization(id, updateOrganization);
        return result;
    }

    @Delete('{id}')
    @Tags ('Organization')
    public async deleteOrganization (@Path() id:string):Promise<IOrganizationVm> {
        const result: IOrganizationVm = await this._organizationRepository.deleteOrganization(id);
        return result;
    }
}


