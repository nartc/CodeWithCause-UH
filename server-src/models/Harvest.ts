import {Document, model, Model, Schema} from 'mongoose';
import {Entry, EntryVm, EntrySchema, IEntry} from './Entry';
import {FarmVm, FarmSchema, IFarm} from './Farm';
import {IBaseModel, IBaseModelVm} from './BaseModel';
// import {Harvest} from '';

export const HarvestSchema = new Schema({
    farm: FarmSchema,
    entries: [EntrySchema],
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
