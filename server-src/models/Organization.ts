import {Document, Model, model, Schema} from 'mongoose';

const OrganizationSchema = new Schema({
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

export interface IOrganization extends Document {
    orgType?: OrganizationType;
    name?: string;
    createdOn?: Date;
    updatedOn?: Date;
}

export interface IOrganizationVm {
    orgType?: OrganizationType;
    name?: string;
    createdOn?: Date;
    updatedOn?: Date;
    _id?:string;
}

export enum OrganizationType {
    Purchased = 'Purchased' as any,
    Donated = 'Donated' as any,
    Internal = 'Internal' as any
}

export type OrganizationModel = Model<IOrganization>;
export const Organization =  model<IOrganization>('Organization', OrganizationSchema) as OrganizationModel

