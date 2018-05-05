import {Get, Query, Request, Response, Route, Security, Tags} from 'tsoa';
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

import App from '../app';
import {readFileSync} from 'fs';
import {filter, map, uniq} from 'lodash';
import {join} from 'path';
import {BaseController} from './BaseController';
import {IUser, UserRole} from '../models/User';
import {DbCollectionName} from '../models/requests/DbCollectionName';
import {ClearDbResponse} from '../models/responses/ClearDbResponse';

@Route('system')
@Tags('System')
export class SystemController extends BaseController {
    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly _farmRepository: IFarmRepository = new FarmRepository(Farm);
    private readonly _organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly _mongooseConnection: Connection = App.mongooseConnection;

    @Get('importCrops')
    @Security('JWT')
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
            newCrop.variety = !variety[0] ? ['Unknown'] : variety;
            newCrop.pricePerPound = parseFloat(pricePerPound);

            await this._cropRepository.create(newCrop);
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
            collections.forEach(async col => {
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
                    }
                    else
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
            return new Promise<ClearDbResponse[]>(resolve => {
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