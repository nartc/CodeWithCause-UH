import { PercentageType } from './../../app.api';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-generate-report-dialog',
  templateUrl: './generate-report-dialog.component.html',
  styleUrls: ['./generate-report-dialog.component.scss']
})
export class GenerateReportDialogComponent implements OnInit {
  reportType: string;


  constructor() {
    this.reportType = "";
  }

  ngOnInit(): void {
 
  }

  changed(event: any): void {
    this.reportType = event.value;
  }
}
