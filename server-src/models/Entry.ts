import {Document, model, Model, Schema} from 'mongoose';
// import {Crop} from '';

export const EntrySchema = new Schema({
    crop: {
        type: Schema.Types.ObjectId,
        ref: 'Crop',
    },
    pounds: {
        type: Number,
        required: true
    },
    priceTotal: {
        type: Number,
        required: true
    },
    harvester: {
        type: Schema.Types.ObjectId,
        ref: 'Harvester'
    },
    comments: {
        type: String,
        required: true
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
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
});

export interface IEntry extends Document {
    crop: string;
    pounds: number;
    priceTotal: number;
    harvester: string;
    comments: string;
    farm: string;
    recipient: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface IEntryVm {
    crop: string;
    pounds: number;
    priceTotal: number;
    harvester: string;
    comments: string;
    farm: string;
    recipient: string;
    createdOn: Date;
    updatedOn: Date;
}


// export enum EntryRole {
//     Admin = 'Admin' as any,
//     Entry = 'Entry' as any
// }

export type EntryModel = Model<IEntry>;
export const Entry: EntryModel = model<IEntry>('Entry', EntrySchema) as EntryModel;
