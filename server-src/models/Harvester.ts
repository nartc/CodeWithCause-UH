import {Document, model, Model, Schema} from 'mongoose';

export const HarvesterSchema = new Schema({
    firstName: String,
    lastName: String,
    createdOn: {
        type: String,
        default: Date.now()
    }
});

export interface IHarvester extends Document {
    firstName?: string;
    lastName?: string;
    createdOn?: Date;
}

export interface IHarvesterVm {
    _id?: string;
    firstName?: string;
    lastName?: string;
    createdOn?: Date;
}

export type HarvestModel = Model<IHarvester>;
export const Harvester: HarvestModel = model<IHarvester>('Harvester', HarvesterSchema) as HarvestModel;