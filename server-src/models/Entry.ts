import {Document, model, Model, Schema} from 'mongoose';
import {ICropVm} from './Crop';
import {IHarvesterVm} from './Harvester';
import {IFarmVm} from './Farm';
import {IOrganizationVm} from './organization';
// import {Crop} from '';

export const EntrySchema = new Schema({
    crop: {
        type: Schema.Types.ObjectId,
        ref: 'Crop',
    },
    pounds: {
        type: Number,
    },
    priceTotal: {
        type: Number,
    },
    harvester: {
        type: Schema.Types.ObjectId,
        ref: 'Harvester'
    },
    comments: {
        type: String,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
    selectedVariety: String
});

export interface IEntry extends Document {
    crop: string;
    pounds: number;
    priceTotal: number;
    harvester: string;
    comments: string;
    recipient: string;
    createdOn: Date;
    updatedOn: Date;
    selectedVariety: string;
}

export interface IEntryVm {
    crop: ICropVm;
    pounds: number;
    priceTotal: number;
    harvester: IHarvesterVm;
    comments: string;
    recipient: IOrganizationVm;
    createdOn: Date;
    updatedOn: Date;
    selectedVariety: string;
    _id?: string;
}


// export enum EntryRole {
//     Admin = 'Admin' as any,
//     Entry = 'Entry' as any
// }

export type EntryModel = Model<IEntry>;
export const Entry: EntryModel = model<IEntry>('Entry', EntrySchema) as EntryModel;
