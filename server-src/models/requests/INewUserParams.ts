import {UserRole} from '../User';

export interface INewUserParams {
    username: string;
    password: string;
    role: UserRole;
}