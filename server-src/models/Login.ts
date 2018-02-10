import {UserRole} from "./User"
export interface ILoginVm {
    authToken: string;
    username?: string;
    role?: UserRole;
    _id?: string;
}
