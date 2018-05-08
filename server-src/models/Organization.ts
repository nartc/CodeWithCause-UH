import {Model, model, Schema} from 'mongoose';
import {IBaseModel, IBaseModelVm} from './BaseModel';

export const OrganizationSchema = new Schema({
    orgType: {
        type: String,
        enum: ['Purchased', 'Donated', 'Internal'],
        default: 'Internal'
    },
    name: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    }
});

export interface IOrganization extends IBaseModel {
    orgType?: OrganizationType;
    name?: string;
}

export interface OrganizationVm extends IBaseModelVm {
    orgType?: OrganizationType;
    name?: string;
}

export enum OrganizationType {
    Purchased = 'Purchased' as any,
    Donated = 'Donated' as any,
    Internal = 'Internal' as any
}

export type OrganizationModel = Model<IOrganization>;
export const Organization = model<IOrganization>('Organization', OrganizationSchema) as OrganizationModel
