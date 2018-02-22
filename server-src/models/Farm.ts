import {model, Model, Schema} from 'mongoose';
import {IBaseModel, IBaseModelVm} from './BaseModel';

export const FarmSchema = new Schema({
    name: {
        type: String,
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
});

export interface IFarm extends IBaseModel {
    name: string;
    lat: number;
    lng: number;
}

export interface FarmVm extends IBaseModelVm {
    name: string;
    lat: number;
    lng: number;
}

export type FarmModel = Model<IFarm>;
export const Farm: FarmModel = model<IFarm>('Farm', FarmSchema) as FarmModel;
