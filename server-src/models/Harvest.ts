import {Document, model, Model, Schema} from 'mongoose';
import {Entry} from "./Entry";
// import {Harvest} from '';

export const HarvestSchema = new Schema({
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'Entry',
        default: []
    }],
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
});

export interface IHarvest extends Document {
    farm: string;
    entries: any;
    createdOn: Date;
    updatedOn: Date;
}

export interface IHarvestVm {
    farm: string;
    entries: any;
    createdOn: Date;
    updatedOn: Date;
}

export type HarvestModel = Model<IHarvest>;
export const Harvest: HarvestModel = model<IHarvest>('Harvest', HarvestSchema) as HarvestModel;
