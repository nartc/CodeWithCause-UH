import {Document, model, Model, Schema} from 'mongoose';
import {IBaseModel, IBaseModelVm} from './BaseModel';
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

export interface IHarvester extends IBaseModel {
    firstName: string;
    lastName: string;
}

export interface HarvesterVm extends IBaseModelVm {
    firstName: string;
    lastName: string;
}


// export enum HarvesterRole {
//     Admin = 'Admin' as any,
//     Harvester = 'Harvester' as any
// }

export type HarvesterModel = Model<IHarvester>;
export const Harvester: HarvesterModel = model<IHarvester>('Harvester', HarvesterSchema) as HarvesterModel;
