import {Body, Controller, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IOrganizationRepository} from '../repositories/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {IOrganization, IOrganizationVm, Organization} from '../models/organization';
import {INewOrganizationParams} from '../models/requests/index.requests';
import {genSalt, hash} from 'bcryptjs';

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
    public async registerUser(@Body() newOrganizationParams: INewOrganizationParams): Promise<IOrganizationVm> {
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


}