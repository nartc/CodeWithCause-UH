import {UserRole} from "./User"
export interface LoginVm {
    authToken: string;
    username?: string;
    role?: UserRole;
    _id?: string;
}
