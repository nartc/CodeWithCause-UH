import {IUserRepository} from './IUserRepository';
import {IUser, UserModel} from '../models/User';
import {BaseRepository} from './BaseRepository';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {

    private _userModel: UserModel;

    constructor(userModel: UserModel) {
        super(userModel);
        this._userModel = userModel;
    }

    public async getUserByUsername(username: string): Promise<IUser> {
        const query = {username};
        return await this._userModel.findOne(query).exec();
    }
}