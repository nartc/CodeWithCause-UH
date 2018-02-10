import {INewEntryParams} from './INewEntryParams';

export interface INewHarvestParams {
    entries: INewEntryParams[];
    farm: string;
}