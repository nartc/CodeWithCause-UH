import {IUserRepository} from './IUserRepository';
import {IUser, UserModel} from '../models/User';

export class UserRepository implements IUserRepository {

    private _userModel: UserModel;

    constructor(userModel: UserModel) {
        this._userModel = userModel;
    }

    public async createUser(newUser: IUser): Promise<IUser> {
        return await this._userModel.create(newUser);
    }

    public async getUserByUsername(username: string): Promise<IUser> {
        const query = {username};
        return await this._userModel.findOne(query);
    }

    public async getUserById(id: string): Promise<IUser> {
        return await this._userModel.findById(id);
    }

    public async updateUser(id: string, updatedUser: IUser): Promise<IUser> {
        return await this._userModel.findByIdAndUpdate(id, updatedUser);
    }

    public async getAll(): Promise<IUser[]> {
        return await this._userModel.find();
    }

    public async deleteUser(id: string): Promise<IUser> {
        return await this._userModel.findByIdAndRemove(id);
    }
}