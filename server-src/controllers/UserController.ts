import {Body, Controller, Get, Path, Post, Route, Tags} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/index.responses';
import {IUserRepository} from '../repositories/IUserRepository';
import {UserRepository} from '../repositories/UserRepository';
import {IUser, IUserVm, User} from '../models/User';
import {INewUserParams} from '../models/requests/index.requests';
import {genSalt, hash} from 'bcryptjs';

@Route('users')
export class UserController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _userRepository: IUserRepository = new UserRepository(User);

    /**
     *
     * @param {INewUserParams} newUserParams
     * @returns {Promise<IUserVm>}
     */
    @Post('create')
    @Tags('System')
    public async registerUser(@Body() newUserParams: INewUserParams): Promise<IUserVm> {
        const username: string = newUserParams.username;
        const password: string = newUserParams.password;

        const existUser: IUser = await this._userRepository.getUserByUsername(username);

        if (existUser instanceof MongoError) throw UserController.resolveErrorResponse(existUser, existUser.message);
        if (existUser) throw UserController.resolveErrorResponse(null, 'Username is already existed');

        console.log(existUser);

        const newUser: IUser = new User();
        newUser.username = username;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        return await <IUserVm>this._userRepository.createUser(newUser);
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<IUserVm>}
     */
    @Get('{username}')
    @Tags('System')
    public async getUserByUsername(@Path() username: string): Promise<IUserVm> {
        const result: IUser = await this._userRepository.getUserByUsername(username);

        if (result instanceof MongoError) throw UserController.resolveErrorResponse(result, result.message);
        if (!result) throw UserController.resolveErrorResponse(null, 'Username does not exist');

        return <IUserVm>result;
    }
}