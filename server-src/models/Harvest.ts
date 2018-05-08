import {model, Model, Schema} from 'mongoose';
import {EntrySchema, EntryVm, IEntry} from './Entry';
import {FarmSchema, FarmVm, IFarm} from './Farm';
import {IBaseModel, IBaseModelVm} from './BaseModel';

export const HarvestSchema = new Schema({
    farm: {
        type: FarmSchema
    },
    entries: {
        type: [EntrySchema],
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

export interface IHarvest extends IBaseModel {
    farm: IFarm;
    entries: IEntry[];
}

export interface HarvestVm extends IBaseModelVm {
    farm: FarmVm;
    entries: EntryVm[];
}

export type HarvestModel = Model<IHarvest>;
export const Harvest: HarvestModel = model<IHarvest>('Harvest', HarvestSchema) as HarvestModel;
