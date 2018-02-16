import { Document } from "mongoose";


export interface IBaseModel extends Document {
    createdOn?: Date;
    updatedOn?: Date;
}

export class IBaseModelVm {
    createdOn?: Date;
    updatedOn?: Date;
    _id?: string;
}