import {IFarmVm} from '../Farm';
import {IOrganizationVm} from '../Organization';

export interface ITotalWeightReport {
    farm?: IFarmVm;
    recipient?: IOrganizationVm;
    total?: number;
    createdOn?: Date;
}