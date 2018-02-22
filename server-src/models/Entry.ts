import {model, Model, Schema} from 'mongoose';
import {CropSchema, CropVm, ICrop} from './Crop';
import {HarvesterSchema, HarvesterVm, IHarvester} from './Harvester';
import {IOrganization, OrganizationSchema, OrganizationVm} from './Organization';
import {IBaseModel, IBaseModelVm} from './BaseModel';

export const EntrySchema = new Schema({
    crop: CropSchema,
    pounds: {
        type: Number,
    },
    priceTotal: {
        type: Number,
    },
    harvester: HarvesterSchema,
    comments: {
        type: String,
    },
    recipient: OrganizationSchema,
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

export interface IEntry extends IBaseModel {
    crop: ICrop;
    pounds: number;
    priceTotal: number;
    harvester: IHarvester;
    comments: string;
    recipient: IOrganization;
    selectedVariety: string;
}

export interface EntryVm extends IBaseModelVm {
    crop: CropVm;
    pounds: number;
    priceTotal: number;
    harvester: HarvesterVm;
    comments: string;
    recipient: OrganizationVm;
    selectedVariety: string;
}

export type EntryModel = Model<IEntry>;
export const Entry: EntryModel = model<IEntry>('Entry', EntrySchema) as EntryModel;
