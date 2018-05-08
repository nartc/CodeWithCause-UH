import {Component, OnInit} from '@angular/core';
import {HarvestClient, HarvestVm} from '../app.api';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-harvest-edit',
  templateUrl: './harvest-edit.component.html',
  styleUrls: ['./harvest-edit.component.scss']
})
export class HarvestEditComponent implements OnInit {
  harvests: HarvestVm[];
  doneLoading = false;
  csvData: any;
  csvFilename: string;
  csvHeaders: any;
  form: FormGroup;
  noStartDate = true;
  filterStartDate: Date;
  filterEndDate: Date;

  constructor(
    private harvestService: HarvestClient,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.harvestService.getAll().subscribe(data => {
      this.harvests = data;
      if (this.harvests.length > 0) {
        this.resolveHarvestDataCsv(data);
        this.doneLoading = true;
      }
      this.doneLoading = true;

    });
  }

  private resolveHarvestDataCsv(harvests: HarvestVm[]) {
    this.csvData = [];
    harvests.forEach(harvest => {
      harvest.entries.forEach(entry => {
        this.csvData.push({
          farm_name: harvest.farm.name,
          crop: entry.crop.name,
          harvester: entry.harvester.firstName + entry.harvester.lastName,
          recipient: entry.recipient.name,
          created_on: moment(entry.createdOn).format('YYYY-MM-DD'),
          updated_on: moment(entry.updatedOn).format('YYYY-MM-DD'),
          selected_variety: entry.selectedVariety,
          pounds: entry.pounds,
          price_total: entry.priceTotal,
          comments: entry.comments
        });
      });
    });
    this.csvFilename = `Harvests_${moment().format('YYYY-MM-DD')}`;
    this.csvHeaders = Object.keys(this.csvData[0]);
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

  routeToEditEntry(harvest, entryIndex) {
    this.router.navigate([`/edit-entry/${harvest._id}/${entryIndex}`]);
  }

  routeToViewEntry(harvest) {
    this.router.navigate([`/review-harvest/${harvest._id}`]);

  }

  onStartDateChanged(value: Date) {
    if (value) {
      this.noStartDate = false;
      this.filterStartDate = value;
    } else {
      return;
    }
  }

  onEndDateChanged(value: Date) {
    if (!value || !this.isValidDate(value)) {
      return;
    } else {
      this.filterEndDate = value;
      this.harvestService.getHarvestsByDateRange([this.filterStartDate, this.filterEndDate])
        .subscribe((harvests: HarvestVm[]) => {
          this.harvests = harvests;
          this.resolveHarvestDataCsv(harvests);
        });
    }
  }

  private isValidDate(value: Date) {
    return moment(value).isSameOrAfter(this.filterStartDate);
  }

  // private dateRangeFilter(startDate: Date, endDate: Date): Date[] {
  //   return [new Date(moment(startDate).format('YYYY-MM-DD')), new Date(moment(endDate).format('YYYY-MM-DD'))];
  // }
}
