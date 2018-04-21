import {WeightValueReportType} from './WeightValueReportType';

export interface ReportByFarm {
    valueReportType: WeightValueReportType;
    dateRange?: [Date, Date];
}