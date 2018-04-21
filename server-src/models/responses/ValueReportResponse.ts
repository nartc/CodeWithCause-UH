export interface ValueReportResponse {
    farmName: string;
    value: number;
}

export interface PercentageByFarmReportResponse {
    farmName: string;
    pounds: number;
    total: number;
    percentageByEntry: string;
    percentageByPound: string;
    percentageByPrice: string;
}