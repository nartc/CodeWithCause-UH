import {OrganizationType} from '../Organization';

export interface INewOrganizationParams {
    name: string;
    orgType?: OrganizationType;
}