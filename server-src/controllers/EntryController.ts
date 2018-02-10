import {Body, Controller, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IEntryRepository} from '../repositories/IEntryRepository';
import {EntryRepository} from '../repositories/EntryRepository';
import {IEntry, Entry, IEntryVm} from '../models/Entry';
import {INewEntryParams} from '../models/requests/index.requests';
import {genSalt, hash} from 'bcryptjs';

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
    @Tags('System')
    public async registerEntry(@Body() newEntryParams: INewEntryParams): Promise<IEntryVm> {

        const newEntry: IEntry = new Entry();
        newEntry.crop = newEntryParams.crop;
        newEntry.pounds = newEntryParams.pounds;
        newEntry.priceTotal = newEntryParams.priceTotal;
        newEntry.comments = newEntryParams.comments;
        newEntry.farm = newEntryParams.farm;
        newEntry.harvester = newEntryParams.harvester;
        newEntry.recipient = newEntryParams.recipient;

        return await <IEntryVm>this._entryRepository.createEntry(newEntry);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IEntryVm>}
     */
    @Get('getAll')
    @Tags('System')
    public async getAll(): Promise<IEntryVm> {
        const result: IEntry = await this._entryRepository.findAll();
        return <IEntryVm>result;
    }
}