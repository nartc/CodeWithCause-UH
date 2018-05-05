import {model, Model, Schema} from 'mongoose';
import {IBaseModel, IBaseModelVm} from './BaseModel';

export const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }
});

export interface IUser extends IBaseModel {
    username?: string;
    password?: string;
    role?: UserRole;
}

export interface UserVm extends IBaseModelVm {
    username?: string;
    password?: string;
    role?: UserRole;
}


export enum UserRole {
    Admin = 'Admin' as any,
    User = 'User' as any
}

export type UserModel = Model<IUser>;
export const User: UserModel = model<IUser>('User', UserSchema) as UserModel;
