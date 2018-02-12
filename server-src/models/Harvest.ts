import {Document, model, Model, Schema} from 'mongoose';
import {Entry, IEntryVm} from './Entry';
import {IFarmVm} from './Farm';
import {IBaseModel, IBaseModelVm} from './BaseModel';
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

export interface IHarvest extends IBaseModel {
    farm: string;
    entries: string[];
}

export interface IHarvestVm extends IBaseModelVm {
    farm: IFarmVm;
    entries: IEntryVm[];
}

export type HarvestModel = Model<IHarvest>;
export const Harvest: HarvestModel = model<IHarvest>('Harvest', HarvestSchema) as HarvestModel;
