import {
  PercentageByFarm,
  PercentageByFarmReportResponse,
  PercentageReportResponse,
  PercentageReportType,
  PercentageType,
  ReportByFarm,
  ReportingClient,
  ValueReportResponse,
  WeightValueReportType
} from '../app.api';
import * as _ from 'lodash';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDatepicker, MatDialog} from '@angular/material';
import 'rxjs/add/operator/filter';
import {forkJoin} from 'rxjs/observable/forkJoin';
import * as moment from 'moment';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';
import * as randomColor from 'randomcolor';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, OnDestroy {
  @ViewChild('startDate') startDate: MatDatepicker<Date>;
  @ViewChild('endDate') endDate: MatDatepicker<Date>;

  token: string;
  reportWeightParams: ReportByFarm = new ReportByFarm();
  reportValueParams: ReportByFarm = new ReportByFarm();
  reportDonatedParams: PercentageByFarm = new PercentageByFarm();
  reportPurchasedParams: PercentageByFarm = new PercentageByFarm();
  donatedPerc: any;
  purchPerc: any;
  farmValue: any;
  farmWeight: any;
  farmLabels: any;
  data: any;
  selected: string;
  renderChart = false;
  totalValue: any;
  totalWeight: any;
  orgTypeData: any[];
  orgTypeReport = false;
  poundsByDonated: any;
  poundsByPurchased: any;
  priceByDonated: any;
  priceByPurchased: any;
  percentagePoundsByDonated: any;
  percentagePoundsByPurchased: any;
  percentagePriceByDonated: any;
  percentagePriceByPurchased: any;
  filteredByDonatedLabels: any;
  filteredByPurchasedLabels: any;
  weightTotal: any;
  amountTotal: any;
  donatedTotal: any;
  purchasedTotal: any;
  csvData: any;
  csvFilename: any;
  csvHeaders: any;
  noStartDate = true;
  filterStartDate: Date;
  filterEndDate: Date;

  constructor(private matDialog: MatDialog,
              private reportingService: ReportingClient) {
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token;
  }

  ngOnInit(): void {
    this.reportWeightParams.valueReportType = WeightValueReportType.Weight;
    this.reportValueParams.valueReportType = WeightValueReportType.Value;
    this.reportDonatedParams.reportType = PercentageReportType.Donated;
    this.reportPurchasedParams.reportType = PercentageReportType.Purchased;

    this.fetchReports();
  }

  private fetchReports() {
    forkJoin(
      this.reportingService.getSalesPercentage(PercentageType.Donated),
      this.reportingService.getSalesPercentage(PercentageType.Purchased),
      this.reportingService.getTotalWeightOrValue(this.reportWeightParams),
      this.reportingService.getTotalWeightOrValue(this.reportValueParams),
      this.reportingService.getPercentageByFarm(this.reportDonatedParams),
      this.reportingService.getPercentageByFarm(this.reportPurchasedParams)
    )
      .subscribe(
        ([donated, purchased, weight, value, donatedByFarm, purchasedByFarm]:
           [PercentageReportResponse, PercentageReportResponse, ValueReportResponse[],
             ValueReportResponse[], PercentageByFarmReportResponse[], PercentageByFarmReportResponse[]]) => {

          this.donatedPerc = donated.percentage;
          this.purchPerc = purchased.percentage;

          this.weightTotal = weight.map(el => el.toJSON());
          this.amountTotal = value.map(el => el.toJSON());
          this.donatedTotal = donatedByFarm.map(el => el.toJSON());
          this.purchasedTotal = purchasedByFarm.map(el => el.toJSON());

          this.farmValue = _.map(value, 'value');
          this.farmWeight = _.map(weight, 'value');
          this.farmLabels = _.map(value, 'farmName');

          this.filteredByDonatedLabels = _.map(_.filter(donatedByFarm, val => val.pounds > 0), 'farmName');
          this.poundsByDonated = _.map(_.filter(donatedByFarm, val => val.pounds > 0), 'pounds');
          this.priceByDonated = _.map(_.filter(donatedByFarm, val => val.total > 0), 'total');
          this.percentagePoundsByDonated = _.map(donatedByFarm, 'percentageByPound');
          this.percentagePriceByDonated = _.map(donatedByFarm, 'percentageByPrice');

          this.filteredByPurchasedLabels = _.map(_.filter(purchasedByFarm, val => val.pounds > 0), 'farmName');
          this.poundsByPurchased = _.map(_.filter(purchasedByFarm, val => val.pounds > 0), 'pounds');
          this.priceByPurchased = _.map(_.filter(purchasedByFarm, val => val.total > 0), 'total');
          this.percentagePoundsByPurchased = _.map(purchasedByFarm, 'percentageByPound');
          this.percentagePriceByPurchased = _.map(purchasedByFarm, 'percentageByPrice');

          this.totalValue = _.reduce(this.farmValue, (sum, n) => {
            return sum + n;
          }, 0);

          this.totalWeight = _.reduce(this.farmWeight, (sum, n) => {
            return sum + n;
          }, 0);
        });
  }

  ngOnDestroy(): void {
    // this.reportingService.configuration.apiKeys['Authorization'] = null;
  }

  downloadCsv() {
    const options = {
      showLabels: true,
      showTitle: true,
      title: this.csvFilename,
      headers: this.csvHeaders
    };
    // noinspection TsLint
    new Angular5Csv(this.csvData, this.csvFilename, options);
  }

  onFilterChange($event): void {

    const bgColor = randomColor({
      count: this.farmLabels.length,
    });

    if (this.selected === 'Value') {
      this.data = {
        labels: this.farmLabels,
        datasets: [
          {
            data: this.farmValue,
            backgroundColor: bgColor,
            hoverBackgroundColor: bgColor
          }]
      };
      this.csvData = this.amountTotal;
      this.csvHeaders = Object.keys(this.csvData[0]);
      this.csvFilename = `Total_Amount_${moment().format('YYYY-MM-DD')}`;
      this.orgTypeReport = false;
    } else if (this.selected === 'Weight') {
      this.data = {
        labels: this.farmLabels,
        datasets: [
          {
            data: this.farmWeight,
            backgroundColor: bgColor,
            hoverBackgroundColor: bgColor
          }]
      };
      this.csvData = this.weightTotal;
      this.csvHeaders = Object.keys(this.csvData[0]);
      this.csvFilename = `Total_Weight_${moment().format('YYYY-MM-DD')}`;
      this.orgTypeReport = false;
    } else if (this.selected === 'Donated') {
      this.orgTypeData = [];
      this.csvData = this.donatedTotal;
      this.csvHeaders = Object.keys(this.csvData[0]);
      this.csvFilename = `Total_Donated_${moment().format('YYYY-MM-DD')}`;
      const data1 = {
        labels: this.filteredByDonatedLabels,
        datasets: [
          {
            data: this.poundsByDonated,
            backgroundColor: randomColor(),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option1 = {
        title: {
          display: true,
          text: 'Pounds (lb) total Donated by Farms',
          fontSize: 16
        }
      };

      const data2 = {
        labels: this.filteredByDonatedLabels,
        datasets: [
          {
            data: this.priceByDonated,
            backgroundColor: randomColor({
              count: this.farmLabels.length,
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option2 = {
        title: {
          display: true,
          text: 'Amount ($) total Donated by Farms',
          fontSize: 16
        }
      };

      const data3 = {
        labels: this.farmLabels,
        datasets: [
          {
            data: this.percentagePoundsByDonated,
            backgroundColor: randomColor({
              count: this.farmLabels.length
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option3 = {
        title: {
          display: true,
          text: 'Pounds percentage Donated by Farms',
          fontSize: 16
        }
      };

      const data4 = {
        labels: this.farmLabels,
        datasets: [
          {
            data: this.percentagePriceByDonated,
            backgroundColor: randomColor({
              count: this.farmLabels.length
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option4 = {
        title: {
          display: true,
          text: 'Amount percentage Donated by Farms',
          fontSize: 16
        }
      };

      this.orgTypeData.push(
        {data: data1, option: option1},
        {data: data2, option: option2});
      this.orgTypeReport = true;
    } else if (this.selected === 'Purchased') {
      this.orgTypeData = [];
      this.csvData = this.donatedTotal;
      this.csvHeaders = Object.keys(this.csvData[0]);
      this.csvFilename = `Total_Purchased_${moment().format('YYYY-MM-DD')}`;
      const data1 = {
        labels: this.filteredByPurchasedLabels,
        datasets: [
          {
            data: this.poundsByPurchased,
            backgroundColor: randomColor({
              count: this.farmLabels.length,
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option1 = {
        title: {
          display: true,
          text: 'Pounds (lb) total Purchased by Farms',
          fontSize: 16
        }
      };

      const data2 = {
        labels: this.filteredByPurchasedLabels,
        datasets: [
          {
            data: this.priceByPurchased,
            backgroundColor: randomColor({
              count: this.farmLabels.length,
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option2 = {
        title: {
          display: true,
          text: 'Amount ($) total Purchased by Farms',
          fontSize: 16
        }
      };

      const data3 = {
        labels: this.farmLabels,
        datasets: [
          {
            data: this.percentagePoundsByPurchased,
            backgroundColor: randomColor({
              count: this.farmLabels.length
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option3 = {
        title: {
          display: true,
          text: 'Pounds percentage Purchased by Farms',
          fontSize: 16
        }
      };

      const data4 = {
        labels: this.farmLabels,
        datasets: [
          {
            data: this.percentagePriceByPurchased,
            backgroundColor: randomColor({
              count: this.farmLabels.length
            }),
            hoverBackgroundColor: randomColor({
              count: this.farmLabels.length,
              hue: 'random'
            })
          }
        ]
      };

      const option4 = {
        title: {
          display: true,
          text: 'Amount percentage Purchased by Farms',
          fontSize: 16
        }
      };

      this.orgTypeData.push(
        {data: data1, option: option1},
        {data: data2, option: option2});
      this.orgTypeReport = true;
    }

    this.renderChart = true;

  }

  onStartDateChanged(value: Date) {
    if (value) {
      this.noStartDate = false;
      this.filterStartDate = value;
      if (this.filterEndDate) {
        this.refreshReports([this.filterStartDate, this.filterEndDate]);
      }
    } else {
      return;
    }
  }

  onEndDateChanged(value: Date) {
    if (!value || !this.isValidDate(value)) {
      return;
    } else {
      this.filterEndDate = value;
      this.refreshReports([this.filterStartDate, this.filterEndDate]);
    }
  }

  refreshReports(dateRange: Date[] = []) {

    if (dateRange.length === 0) {
      this.startDate._datepickerInput.value = null;
      this.endDate._datepickerInput.value = null;
      // this.filterEndDate = null;
      // this.filterStartDate = null;
    }

    this.setDateRangeParams(dateRange);
    this.fetchReports();
    if (this.selected) {
      this.onFilterChange(null);
    }
  }

  private setDateRangeParams(dateRange: Date[]) {
    this.reportWeightParams.dateRange = dateRange;
    this.reportValueParams.dateRange = dateRange;
    this.reportDonatedParams.dateRange = dateRange;
    this.reportPurchasedParams.dateRange = dateRange;
  }

  private isValidDate(value: Date) {
    return moment(value).isSameOrAfter(this.filterStartDate);
  }
}
