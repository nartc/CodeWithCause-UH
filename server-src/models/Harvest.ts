import {Document, model, Model, Schema} from 'mongoose';
import {Entry, IEntryVm} from './Entry';
import {IFarmVm} from './Farm';
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
    entries: string[];
    createdOn: Date;
    updatedOn: Date;
}

export interface IHarvestVm {
    farm: IFarmVm;
    entries: IEntryVm[];
    createdOn: Date;
    updatedOn: Date;
    _id?: string;
}

export type HarvestModel = Model<IHarvest>;
export const Harvest: HarvestModel = model<IHarvest>('Harvest', HarvestSchema) as HarvestModel;
