import {Body, Delete, Get, Path, Post, Route, Tags} from 'tsoa';
import {IHarvesterRepository} from '../repositories/IHarvesterRepository';
import {HarvesterRepository} from '../repositories/HarvesterRepository';
import {Harvester, IHarvester, HarvesterVm} from '../models/Harvester';
import {INewHarvesterParams} from '../models/requests/index.requests';
import {BaseController} from './BaseController';

@Route('harvesters')
export class HarvesterController extends BaseController {
    private readonly _harvesterRepository: IHarvesterRepository = new HarvesterRepository(Harvester);

    /**
     *
     * @param {INewHarvesterParams} newHarvesterParams
     * @returns {Promise<HarvesterVm>}
     */
    @Post('create')
    @Tags('Harvester')
    public async registerHarvester(@Body() newHarvesterParams: INewHarvesterParams): Promise<HarvesterVm> {

        const newHarvester: IHarvester = new Harvester();
        newHarvester.firstName = newHarvesterParams.firstName;
        newHarvester.lastName = newHarvesterParams.lastName;

        return await <HarvesterVm>this._harvesterRepository.create(newHarvester);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<HarvesterVm>}
     */
    @Get('getAll')
    @Tags('Harvester')
    public async getAll(): Promise<HarvesterVm[]> {
        const result: IHarvester[] = await this._harvesterRepository.getAll();
        return <HarvesterVm[]>result;
    }

    @Delete('{id}')
    @Tags('Harvester')
    public async deleteHarvesterById(@Path() id: string): Promise<HarvesterVm> {
        return await <HarvesterVm>this._harvesterRepository.delete(id);
    }
}