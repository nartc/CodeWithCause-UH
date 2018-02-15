import {Document, model, Model, Schema} from 'mongoose';
import {ICropVm, ICrop, CropSchema} from './Crop';
import {IHarvesterVm, IHarvester, HarvesterSchema} from './Harvester';
import {IFarmVm} from './Farm';
import {IOrganizationVm, IOrganization, OrganizationSchema} from './Organization';
import {IBaseModel, IBaseModelVm} from './BaseModel';
// import {Crop} from '';

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

export interface IEntryVm extends IBaseModelVm {
    crop: ICropVm;
    pounds: number;
    priceTotal: number;
    harvester: IHarvesterVm;
    comments: string;
    recipient: IOrganizationVm;
    selectedVariety: string;
}


// export enum EntryRole {
//     Admin = 'Admin' as any,
//     Entry = 'Entry' as any
// }

export type EntryModel = Model<IEntry>;
export const Entry: EntryModel = model<IEntry>('Entry', EntrySchema) as EntryModel;
