import {Body, Controller, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {ICropRepository} from '../repositories/ICropRepository';
import {CropRepository} from '../repositories/CropRepository';
import {ICrop, Crop, ICropVm} from '../models/Crop';
import {INewCropParams} from '../models/requests/index.requests';
import {genSalt, hash} from 'bcryptjs';

@Route('crops')
export class CropController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _cropRepository: ICropRepository = new CropRepository(Crop);

    /**
     *
     * @param {INewCropParams} newCropParams
     * @returns {Promise<ICropVm>}
     */
    @Post('create')
    @Tags('System')
    public async registerCrop(@Body() newCropParams: INewCropParams): Promise<ICropVm> {

        const newCrop: ICrop = new Crop();
        newCrop.name = newCropParams.name;
        newCrop.variety = newCropParams.variety;
        newCrop.pricePerPound = newCropParams.pricePerPound;

        return await <ICropVm>this._cropRepository.createCrop(newCrop);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<ICropVm>}
     */
    @Get('getAll')
    @Tags('System')
    public async getAll(): Promise<ICropVm> {
        const result: ICrop = await this._cropRepository.findAll();
        return <ICropVm>result;
    }
}