import {Document, model, Model, Schema} from 'mongoose';
import {IBaseModel, IBaseModelVm} from './BaseModel';
// import {Farm} from '';

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

export interface IFarmVm extends IBaseModelVm {
    name: string;
    lat: number;
    lng: number;
}


// export enum FarmRole {
//     Admin = 'Admin' as any,
//     Farm = 'Farm' as any
// }

export type FarmModel = Model<IFarm>;
export const Farm: FarmModel = model<IFarm>('Farm', FarmSchema) as FarmModel;
