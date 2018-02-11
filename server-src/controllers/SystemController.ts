import {Controller, Get, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {ICropRepository} from '../repositories/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {Crop, ICrop, ICropVm} from '../models/Crop';
import {IFarmRepository} from '../repositories/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm} from '../models/Farm';
import {IOrganizationRepository} from '../repositories/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {Organization} from '../models/Organization';
import {Connection} from 'mongoose';

import App from '../app';
import {readFileSync} from 'fs';
import {filter, map, uniq} from 'lodash';
import {join} from 'path';

@Route('system')
export class SystemController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _mongooseConnection: Connection = App.mongooseConnection;

    @Get('importCrops')
    @Tags('System')
    public async importCrops(): Promise<ICropVm[]> {
        // Check Crop collection
        const cropCollection = await this._mongooseConnection.db.listCollections({name: 'crops'}).toArray();
        if (cropCollection.length > 0) {
            await this._mongooseConnection.db.dropCollection('crops');
        }

        const cropCSVData = JSON.parse(readFileSync(join(__dirname, '../../assets/CropCSV.json'), {encoding: 'utf8'}));
        console.log(cropCSVData);
        const cropTypes: string[] = uniq(map(cropCSVData, 'Crop'));
        cropTypes.forEach(async type => {
            const variety = [...map(filter(cropCSVData, c => c.Crop === type), 'Variety')];
            const pricePerPound = filter(cropCSVData, c => c.Crop === type)[0].Price.slice(1);
            const newCrop: ICrop = new Crop();
            newCrop.name = type;
            newCrop.variety = variety;
            newCrop.pricePerPound = parseFloat(pricePerPound);

            await this._cropRepository.createCrop(newCrop);
        });

        return await <ICropVm[]>this._cropRepository.findAll();
    }
}