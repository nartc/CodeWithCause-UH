import {IUser} from '../models/User';

export interface IUserRepository {
    createUser(newUser: IUser);

    getUserByUsername(username: string);

    getUserById(id: string);

    updateUser(id: string, updatedUser: IUser);

    getAll();

    deleteUser(id: string);
}