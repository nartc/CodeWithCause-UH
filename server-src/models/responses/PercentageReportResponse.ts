import {PercentageReportType} from '../requests/PercentageReportType';

export interface PercentageReportResponse {
    type?: PercentageReportType;
    createdOn?: Date;
    percentage?: string;
}