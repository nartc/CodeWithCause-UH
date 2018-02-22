import {Get, Request, Route, Security, Tags} from 'tsoa';
import {ICropRepository} from '../repositories/interfaces/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {Crop, ICrop, CropVm} from '../models/Crop';
import {IFarmRepository} from '../repositories/interfaces/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm} from '../models/Farm';
import {IOrganizationRepository} from '../repositories/interfaces/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {Organization} from '../models/Organization';
import {Connection} from 'mongoose';
import {Request as ExpressRequest} from 'express';

import App from '../app';
import {readFileSync} from 'fs';
import {filter, map, uniq} from 'lodash';
import {join} from 'path';
import {BaseController} from './BaseController';
import {IUser, UserRole} from '../models/User';

@Route('system')
export class SystemController extends BaseController {
    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _mongooseConnection: Connection = App.mongooseConnection;

    @Get('importCrops')
    @Security('JWT')
    @Tags('System')
    public async importCrops(@Request() request: ExpressRequest): Promise<CropVm[]> {
        const currentUser: IUser = request.user;

        if (currentUser.role !== UserRole.Admin) {
            throw SystemController.resolveErrorResponse(null, 'Unauthorized');
        }
        // Check Crop collection
        const cropCollection = await this._mongooseConnection.db.listCollections({name: 'crops'}).toArray();
        if (cropCollection.length > 0) {
            await this._mongooseConnection.db.dropCollection('crops');
        }

        const cropCSVData = JSON.parse(readFileSync(join(__dirname, '../../assets/CropCSV.json'), {encoding: 'utf8'}));
        const cropTypes: string[] = uniq(map(cropCSVData, 'Crop'));
        cropTypes.forEach(async type => {
            const variety = [...map(filter(cropCSVData, c => c.Crop === type), 'Variety')];
            const pricePerPound = filter(cropCSVData, c => c.Crop === type)[0].Price.slice(1);
            const newCrop: ICrop = new Crop();
            newCrop.name = type;
            newCrop.variety = variety;
            newCrop.pricePerPound = parseFloat(pricePerPound);

            await this._cropRepository.create(newCrop);
        });

        return new Promise<CropVm[]>(((resolve, reject) => {
            setTimeout(async () => {
                resolve(await <CropVm[]>this._cropRepository.getAll());
            }, 500)
        }));
    }

}