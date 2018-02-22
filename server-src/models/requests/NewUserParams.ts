import {UserRole} from '../User';

export interface NewUserParams {
    username: string;
    password: string;
    role: UserRole;
}