import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {sign} from 'jsonwebtoken'
import {get} from 'config'
import {MongoError} from 'mongodb';
import {IUserRepository} from '../repositories/interfaces/IUserRepository';
import {UserRepository} from '../repositories/UserRepository';
import {IUser, User, UserRole, UserVm} from '../models/User';
import {NewUserParams} from '../models/requests/NewUserParams';
import {compare, genSalt, hash} from 'bcryptjs';
import {LoginVm} from '../models/Login';
import {LoginParams} from '../models/requests/LoginParams';
import * as moment from 'moment';
import {BaseController} from './BaseController';

@Route('users')
export class UserController extends BaseController {
    private _userRepository: IUserRepository = new UserRepository(User);

    /**
     *
     * @param {NewUserParams} newUserParams
     * @returns {Promise<UserVm>}
     */
    @Post('create')
    @Tags('System')
    public async registerUser(@Body() newUserParams: NewUserParams): Promise<UserVm> {
        const username: string = newUserParams.username;
        const password: string = newUserParams.password;
        const role: UserRole = UserRole.User;

        const existUser: IUser = await this._userRepository.getUserByUsername(username);

        if (existUser instanceof MongoError) throw UserController.resolveErrorResponse(existUser, existUser.message);
        if (existUser) throw UserController.resolveErrorResponse(null, 'Username is already existed');

        const newUser: IUser = new User();
        newUser.username = username;
        newUser.role = role;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        return await this._userRepository.create(newUser) as UserVm;
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<UserVm>}
     */
    @Get('{username}')
    @Tags('System')
    public async getUserByUsername(@Path() username: string): Promise<UserVm> {
        const result: IUser = await this._userRepository.getUserByUsername(username);

        if (result instanceof MongoError) throw UserController.resolveErrorResponse(result, result.message);
        if (!result) throw UserController.resolveErrorResponse(null, 'Username does not exist');

        return result as UserVm;
    }

    /**
     *
     * @param {LoginParams} loginParams
     * @returns {Promise<LoginVm>}
     */
    @Post('login')
    @Tags('System')
    public async login(@Body() loginParams: LoginParams): Promise<LoginVm> {

        const {username, password} = loginParams;

        const fetchedUser: IUser = await this._userRepository.getUserByUsername(username);
        if (fetchedUser instanceof MongoError)
            throw UserController.resolveErrorResponse(fetchedUser, fetchedUser.message);

        if (!fetchedUser || fetchedUser === null) throw UserController.resolveErrorResponse(null, 'Does not exist');

        const isMatched: boolean = await compare(password, fetchedUser.password);
        if (!isMatched) throw UserController.resolveErrorResponse(null, 'Password does not match');

        const payload = {user: fetchedUser};
        const secret = process.env.JWT_SECRET || get('auth.jwt-secret');
        const token: string = sign(payload, secret, {expiresIn: '12h'});
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
    public async getAllUsers(): Promise<UserVm[]> {
        return await this._userRepository.getAll() as UserVm[];
    }

    @Delete('{id}')
    @Tags('System')
    public async deleteUserById(@Path() id: string): Promise<UserVm> {
        return await this._userRepository.delete(id) as UserVm;
    }

    @Put('{id}')
    @Tags('System')
    public async udpateUserById(@Path() id: string, @Body() updateUserParams: NewUserParams): Promise<UserVm> {
        const existedUser: IUser = await this._userRepository.getResourceById(id);

        if (!existedUser || existedUser === null) {
            throw UserController.resolveErrorResponse(null, 'Not found');
        }

        const updatedUser: IUser = new User();
        updatedUser._id = existedUser._id;
        updatedUser.createdOn = existedUser.createdOn;
        updatedUser.updatedOn = moment().toDate();
        updatedUser.username = updateUserParams.username;
        updatedUser.password = existedUser.password;
        updatedUser.role = updateUserParams.role;

        return await this._userRepository.update(id, updatedUser) as UserVm;
    }
}
