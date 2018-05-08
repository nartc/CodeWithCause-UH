import {WeightValueReportType} from './WeightValueReportType';
import {PercentageReportType} from './PercentageReportType';

export interface ReportByFarm {
    valueReportType: WeightValueReportType;
    dateRange?: Date[];
}

export interface PercentageByFarm {
    reportType: PercentageReportType;
    dateRange?: Date[];
}
