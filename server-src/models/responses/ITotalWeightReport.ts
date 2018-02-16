import {FarmVm} from '../Farm';
import {OrganizationVm} from '../Organization';

export interface TotalWeightReport {
    farm?: FarmVm;
    recipient?: OrganizationVm;
    total?: number;
    createdOn?: Date;
}