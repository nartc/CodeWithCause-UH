import {Body, Controller, Delete, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IHarvesterRepository} from '../repositories/IHarvesterRepository';
import {HarvesterRepository} from '../repositories/HarvesterRepository';
import {Harvester, IHarvester, IHarvesterVm} from '../models/Harvester';
import {INewHarvesterParams} from '../models/requests/index.requests';

@Route('harvesters')
export class HarvesterController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _harvesterRepository: IHarvesterRepository = new HarvesterRepository(Harvester);

    /**
     *
     * @param {INewHarvesterParams} newHarvesterParams
     * @returns {Promise<IHarvesterVm>}
     */
    @Post('create')
    @Tags('Harvester')
    public async registerHarvester(@Body() newHarvesterParams: INewHarvesterParams): Promise<IHarvesterVm> {

        const newHarvester: IHarvester = new Harvester();
        newHarvester.firstName = newHarvesterParams.firstName;
        newHarvester.lastName = newHarvesterParams.lastName;

        return await <IHarvesterVm>this._harvesterRepository.createHarvester(newHarvester);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IHarvesterVm>}
     */
    @Get('getAll')
    @Tags('Harvester')
    public async getAll(): Promise<IHarvesterVm[]> {
        const result: IHarvester[] = await this._harvesterRepository.findAll();
        return <IHarvesterVm[]>result;
    }

    @Delete('{id}')
    @Tags('Harvester')
    public async deleteHarvesterById(@Path() id: string): Promise<IHarvesterVm> {
        return await <IHarvesterVm>this._harvesterRepository.delete(id);
    }
}