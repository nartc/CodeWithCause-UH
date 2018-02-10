import {Document, model, Model, Schema} from 'mongoose';

const UserSchema = new Schema({
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
    },
    nameLists: [String]
});

export interface IUser extends Document {
    username?: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    role?: UserRole;
    nameLists?: string[];
}


export enum UserRole {
    Admin = 'Admin' as any,
    User = 'User' as any
}

export type UserModel = Model<IUser>;
export const User: UserModel = model<IUser>('User', UserSchema) as UserModel;
