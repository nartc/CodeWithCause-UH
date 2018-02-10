import {Document, model, Model, Schema} from 'mongoose';
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

export interface ICrop extends Document {
    name: string;
    variety: string;
    pricePerPound: number;
    createdOn: Date;
    updatedOn: Date;
}

export interface ICropVm {
    name: string;
    variety: string;
    pricePerPound: number;
    createdOn: Date;
    updatedOn: Date;
}


// export enum CropRole {
//     Admin = 'Admin' as any,
//     Crop = 'Crop' as any
// }

export type CropModel = Model<ICrop>;
export const Crop: CropModel = model<ICrop>('Crop', CropSchema) as CropModel;
