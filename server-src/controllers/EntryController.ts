import {Body, Controller, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {IEntry, Entry, IEntryVm} from '../models/Entry';
import {INewEntryParams} from '../models/requests/index.requests';

@Route('entries')
export class EntryController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _entryRepository: IEntryRepository = new EntryRepository(Entry);

    /**
     *
     * @param {INewEntryParams} newEntryParams
     * @returns {Promise<IEntryVm>}
     */
    @Post('create')
    @Tags('Entry')
    public async registerEntry(@Body() newEntryParams: INewEntryParams): Promise<IEntryVm> {

        const newEntry: IEntry = new Entry();
        newEntry.crop = newEntryParams.crop;
        newEntry.pounds = newEntryParams.pounds;
        newEntry.priceTotal = newEntryParams.priceTotal;
        newEntry.comments = newEntryParams.comments;
        newEntry.harvester = newEntryParams.harvester;
        newEntry.recipient = newEntryParams.recipient;

        return await <IEntryVm>this._entryRepository.createEntry(newEntry);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IEntryVm[]>}
     */
    @Get('getAll')
    @Tags('Entry')
    public async getAll(): Promise<IEntryVm[]> {
        return await <IEntryVm[]>this._entryRepository.findAll();
    }

    @Get('{id}')
    @Tags('Entry')
    public async getSingleEntry(@Path() id: string): Promise<IEntryVm> {
        return await <IEntryVm>this._entryRepository.getEntryById(id);
    }

    // @Put('{id}')
    // @Tags('Entry')
    // public async updateEntry(@Path() id: string, @Body() updatedEntryParams: INewEntryParams): Promise<IEntryVm> {
    //     // const updatedFarm: IFarm = new Entr();
    //
    // }
}