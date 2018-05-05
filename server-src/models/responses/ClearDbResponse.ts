import {DeleteWriteOpResultObject} from 'mongodb';

export interface ClearDbResponse extends DeleteWriteOpResultObject {
    collection?: string;
}