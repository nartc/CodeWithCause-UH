import {Document, model, Model, Schema} from 'mongoose';
import {Entry, IEntryVm, EntrySchema, IEntry} from './Entry';
import {IFarmVm, FarmSchema, IFarm} from './Farm';
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

export interface IHarvestVm extends IBaseModelVm {
    farm: IFarmVm;
    entries: IEntryVm[];
}

export type HarvestModel = Model<IHarvest>;
export const Harvest: HarvestModel = model<IHarvest>('Harvest', HarvestSchema) as HarvestModel;
