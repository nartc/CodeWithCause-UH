import {Document, model, Model, Schema} from 'mongoose';
// import {Harvester} from '';

export const HarvesterSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
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

export interface IHarvester extends Document {
    firstName: string;
    lastName: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface IHarvesterVm {
    firstName: string;
    lastName: string;
    createdOn: Date;
    updatedOn: Date;
    _id?: string;
}


// export enum HarvesterRole {
//     Admin = 'Admin' as any,
//     Harvester = 'Harvester' as any
// }

export type HarvesterModel = Model<IHarvester>;
export const Harvester: HarvesterModel = model<IHarvester>('Harvester', HarvesterSchema) as HarvesterModel;
