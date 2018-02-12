import {Body, Delete, Get, Path, Post, Route, Tags} from 'tsoa';
import {IHarvesterRepository} from '../repositories/IHarvesterRepository';
import {HarvesterRepository} from '../repositories/HarvesterRepository';
import {Harvester, IHarvester, IHarvesterVm} from '../models/Harvester';
import {INewHarvesterParams} from '../models/requests/index.requests';
import {BaseController} from './BaseController';

@Route('harvesters')
export class HarvesterController extends BaseController {
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

        return await <IHarvesterVm>this._harvesterRepository.create(newHarvester);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IHarvesterVm>}
     */
    @Get('getAll')
    @Tags('Harvester')
    public async getAll(): Promise<IHarvesterVm[]> {
        const result: IHarvester[] = await this._harvesterRepository.getAll();
        return <IHarvesterVm[]>result;
    }

    @Delete('{id}')
    @Tags('Harvester')
    public async deleteHarvesterById(@Path() id: string): Promise<IHarvesterVm> {
        return await <IHarvesterVm>this._harvesterRepository.delete(id);
    }
}