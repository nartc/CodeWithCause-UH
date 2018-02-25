import {model, Model, Schema} from 'mongoose';
import {IBaseModel, IBaseModelVm} from './BaseModel';
// import {Crop} from '';

export const CropSchema = new Schema({
    name: {
        type: String,
    },
    variety: {
        type: [String],
        default: ['unknown']
    },
    pricePerPound: {
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

export interface ICrop extends IBaseModel {
    name: string;
    variety: string[];
    pricePerPound: number;
}

export interface CropVm extends IBaseModelVm {
    name: string;
    variety: string[];
    pricePerPound: number;
}

export type CropModel = Model<ICrop>;
export const Crop: CropModel = model<ICrop>('Crop', CropSchema) as CropModel;
