import {Document, Model, model, Schema} from 'mongoose';

const OrganizationSchema = new Schema({
    purchase: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    contactName: {
        type: String,
        required: true
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
    phoneNumber?:Number;
}

export interface IOrganizationVm {
    purchase?: boolean;
    name?: string;
    contactName?:string;
    createdOn?: Date;
    updatedOn?: Date;
    phoneNumber?:Number;
    _id:string;
}

export type OrganizationModel = Model<IOrganization>;
export const Organization =  model<IOrganization>('Organization', OrganizationSchema) as OrganizationModel

