import {OrganizationType} from '../Organization';

export interface NewOrganizationParams {
    name: string;
    orgType?: OrganizationType;
}