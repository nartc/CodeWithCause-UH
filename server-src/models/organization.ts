import {Document, Model, model, Schema} from 'mongoose';

const OrganizationSchema = new Schema({
    purchase: {
        type: Boolean,
    },
    name: {
        type: String,
    },
    phoneNumber:{
        type:String,
    },
    contactName: {
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
    purchase?: boolean;
    name?: string;
    contactName?:string;
    createdOn?: Date;
    updatedOn?: Date;
    phoneNumber?:string;
}

export interface IOrganizationVm {
    purchase?: boolean;
    name?: string;
    createdOn?: Date;
    updatedOn?: Date;
    contactName?:string;
    phoneNumber?:string;
    _id?:string;
}

export type OrganizationModel = Model<IOrganization>;
export const Organization =  model<IOrganization>('Organization', OrganizationSchema) as OrganizationModel

