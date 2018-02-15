import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {sign} from 'jsonwebtoken'
import * as config from 'config'
import {MongoError} from 'mongodb';
import {IUserRepository} from '../repositories/IUserRepository';
import {UserRepository} from '../repositories/UserRepository';
import {IUser, IUserVm, User, UserRole} from '../models/User';
import {INewUserParams} from '../models/requests/index.requests';
import {compare, genSalt, hash} from 'bcryptjs';
import {ILoginVm} from '../models/Login';
import {ILoginParams} from '../models/requests/ILoginParams';
import * as moment from 'moment';
import {BaseController} from './BaseController';

@Route('users')
export class UserController extends BaseController {
    private _userRepository: IUserRepository = new UserRepository(User);

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
        const role: UserRole = newUserParams.role;

        const existUser: IUser = await this._userRepository.getUserByUsername(username);

        if (existUser instanceof MongoError) throw UserController.resolveErrorResponse(existUser, existUser.message);
        if (existUser) throw UserController.resolveErrorResponse(null, 'Username is already existed');


        const newUser: IUser = new User();
        newUser.username = username;
        newUser.role = role;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        return await <IUserVm>this._userRepository.create(newUser);
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

    /**
     *
     * @param {ILoginParams} loginParams
     * @returns {Promise<ILoginVm>}
     */
    @Post('login')
    @Tags('System')
    public async login(@Body() loginParams: ILoginParams): Promise<ILoginVm> {

        const username: string = loginParams.username;
        const password: string = loginParams.password;

        const fetchedUser: IUser = await this._userRepository.getUserByUsername(username);
        if (fetchedUser instanceof MongoError)
            throw UserController.resolveErrorResponse(fetchedUser, fetchedUser.message);

        if (!fetchedUser || fetchedUser === null) throw UserController.resolveErrorResponse(null, 'Does not exist');

        const isMatched: boolean = await compare(password, fetchedUser.password);
        if (!isMatched) throw UserController.resolveErrorResponse(null, 'Password does not match');

        const payload = {user: fetchedUser};
        const secret = process.env.JWT_SECRET || config.get('auth.jwt-secret');
        const token: string = sign(payload, secret, {expiresIn: '12h'});
        if (!token) throw UserController.resolveErrorResponse(null, 'Error signing payload');

        try {
            const result = await fetchedUser.save();
            return {
                authToken: `JWT ${token}`,
                _id: result._id,
                username: result.username,
                role: result.role,
            };
        } catch (error) {
            throw UserController.resolveErrorResponse(
                error instanceof MongoError ? error : null,
                error instanceof MongoError ? error.message : 'Unexpected Error');
        }
    }

    @Get('')
    @Tags('System')
    public async getAllUsers(): Promise<IUserVm[]> {
        return await <IUserVm[]>this._userRepository.getAll();
    }

    @Delete('{id}')
    @Tags('System')
    public async deleteUserById(@Path() id: string): Promise<IUserVm> {
        return await <IUserVm>this._userRepository.delete(id);
    }

    @Put('{id}')
    @Tags('System')
    public async udpateUserById(@Path() id: string, @Body() updateUserParams: INewUserParams): Promise<IUserVm> {
        const existedUser: IUser = await this._userRepository.getResourceById(id);

        if (!existedUser || existedUser === null) {
            throw UserController.resolveErrorResponse(null, 'Not found');
        }

        const updatedUser: IUser = new User();
        updatedUser._id = existedUser._id;
        updatedUser.createdOn = existedUser.createdOn;
        updatedUser.updatedOn = moment().toDate();
        updatedUser.username = updateUserParams.username;
        updatedUser.password = updateUserParams.password;
        updatedUser.role = updateUserParams.role;

        return await <IUserVm>this._userRepository.update(id, updatedUser);
    }
}