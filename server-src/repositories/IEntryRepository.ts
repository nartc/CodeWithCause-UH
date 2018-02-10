import {IEntry} from '../models/entry';

export interface IEntryRepository {
    createEntry(entry: IEntry);
    findAll();
    // getUserByUsername(username: string);
    //
    // getUserById(id: string);
    //
    // updateUser(id: string, updatedUser: IUser);
}