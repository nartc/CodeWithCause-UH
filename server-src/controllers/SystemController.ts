import {FormFile, Get, Post, Query, Request, Response, Route, Security, Tags} from 'tsoa';
import {ICropRepository} from '../repositories/interfaces/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {Crop, CropVm, ICrop} from '../models/Crop';
import {IFarmRepository} from '../repositories/interfaces/IFarmRepository';
import {FarmRepository} from '../repositories/FarmRepository';
import {Farm} from '../models/Farm';
import {IOrganizationRepository} from '../repositories/interfaces/IOrganizationRepository';
import {OrganizationRepository} from '../repositories/OrganizationRepository';
import {Organization} from '../models/Organization';
import {Connection} from 'mongoose';
import {Request as ExpressRequest} from 'express';
import * as multer from 'multer';
import * as csv2json from 'csvtojson';

import App from '../app';
import {filter, map, uniq} from 'lodash';
import {join} from 'path';
import {BaseController} from './BaseController';
import {IUser, UserRole} from '../models/User';
import {DbCollectionName} from '../models/requests/DbCollectionName';
import {ClearDbResponse} from '../models/responses/ClearDbResponse';
import {FileParameter} from '../models/requests/FileParameter';

@Route('system')
@Tags('System')
export class SystemController extends BaseController {
    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _mongooseConnection: Connection = App.mongooseConnection;

    @Post('uploadFile')
    @Security('JWT')
    public async uploadFile(@Request() request: ExpressRequest, @FormFile('csv') csv: FileParameter): Promise<any> {
        if (!csv.originalname.match(/\.(csv)$/)) {
            throw SystemController.resolveErrorResponse(null, 'CSV Format only');
        }

        if (!request.user || request.user.role !== UserRole.Admin) {
            throw SystemController.resolveErrorResponse(null, 'Unauthorized');
        }

        return {
            success: true,
            fileName: csv.filename,
            originalName: csv.originalname,
            destination: csv.destination
        }
    }

    @Get('importCrops')
    @Security('JWT')
    public async importCrops(@Request() request: ExpressRequest): Promise<CropVm[]> {
        const currentUser: IUser = request.user;

        if (currentUser.role !== UserRole.Admin) {
            throw SystemController.resolveErrorResponse(null, 'Unauthorized');
        }

        const csvFilePath = join(__dirname, '../../assets/CropData.csv');
        let cropCSVData;

        try {
            cropCSVData = await csv2json().fromFile(csvFilePath);
        } catch (e) {
            throw SystemController.resolveErrorResponse(e, 'Error reading CropData');
        }

        // Check Crop collection
        // const cropCSVData = JSON.parse(readFileSync(join(__dirname, '../../assets/CropCSV.json'), {encoding: 'utf8'}));
        const crops = await this._cropRepository.getAll();

        if (cropCSVData.length === crops.length) {
            await this._mongooseConnection.db.dropCollection('crops');
        }

        const cropTypes: string[] = uniq(map(cropCSVData, 'Crop'));
        cropTypes.forEach(async (type) => {
            const existCropWithType = await this._cropRepository.findByCrop(type);
            const variety = [...map(filter<any>(cropCSVData, (c) => c.Crop === type), 'Variety')];
            const pricePerPound = filter<any>(cropCSVData, (c) => c.Crop === type)[0].Price.slice(1);
            if (!existCropWithType) {

                const newCrop: ICrop = new Crop();
                newCrop.name = type;
                newCrop.variety = !variety[0] ? ['Unknown'] : variety;
                newCrop.pricePerPound = parseFloat(pricePerPound);

                await this._cropRepository.create(newCrop);
            } else {
                const updatedCrop: ICrop = await this._cropRepository.getResourceById(existCropWithType.id);
                updatedCrop.variety = !variety[0] ? ['Unknown'] : variety;
                updatedCrop.pricePerPound = parseFloat(pricePerPound);

                await this._cropRepository.update(updatedCrop.id, updatedCrop);
            }
        });

        return new Promise<CropVm[]>(((resolve, reject) => {
            setTimeout(async () => {
                resolve(await <CropVm[]>this._cropRepository.getAll());
            }, 500)
        }));
    }

    @Get('clearDatabase')
    @Response<ClearDbResponse>(200, 'Clear DB Response')
    @Security('JWT')
    public async clearDatabase(@Request() request: ExpressRequest, @Query() collection: DbCollectionName, @Query() dropUser: boolean = false): Promise<ClearDbResponse | ClearDbResponse[]> {
        const currentUser: IUser = request.user;

        if (currentUser.role !== UserRole.Admin) {
            throw SystemController.resolveErrorResponse(null, 'Unauthorized');
        }
        const collections = collection.toString().split(',');
        if (collections.length > 1) {
            const results: ClearDbResponse[] = [];
            collections.forEach(async (col) => {
                let result: ClearDbResponse;
                if (col === DbCollectionName.User.toString()) {
                    if (dropUser) {
                        const obj = await this._mongooseConnection.collection(col).deleteMany({});
                        result = {
                            result: obj.result,
                            connection: obj.connection,
                            deletedCount: obj.deletedCount,
                            collection: col
                        };
                        results.push(result);
                    } else
                        throw SystemController.resolveErrorResponse(null, 'Cannot drop User without consent');
                }

                const obj = await this._mongooseConnection.collection(col).deleteMany({})

                results.push(<ClearDbResponse>{
                    result: obj.result,
                    deletedCount: obj.deletedCount,
                    connection: obj.connection,
                    collection: col
                });
            });
            return new Promise<ClearDbResponse[]>((resolve) => {
                setTimeout(() => {
                    resolve(results);
                }, 500)
            });

        } else {
            if (collections[0] === DbCollectionName.User.toString()) {
                if (dropUser)
                    return await this._mongooseConnection.collection(collections[0]).deleteMany({});
                else
                    throw SystemController.resolveErrorResponse(null, 'Cannot drop User without consent');
            }

            const result = await this._mongooseConnection.collection(collections[0]).deleteMany({});
            return <ClearDbResponse>{
                result: result.result,
                connection: result.connection,
                deletedCount: result.deletedCount,
                collection: collections[0]
            };
        }
    }
}
