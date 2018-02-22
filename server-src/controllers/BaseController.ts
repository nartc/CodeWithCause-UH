import {MongoError} from 'mongodb';
import {ErrorResponse} from '../models/responses/ErrorResponse';
import {Controller} from 'tsoa';

export class BaseController extends Controller {
    public static resolveErrorResponse(error: MongoError | null, message: string): ErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }
}