import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {INewFarmParams} from '../../app.api';

@Component({
  selector: 'app-edit-farm-dialog',
  templateUrl: './edit-farm-dialog.component.html',
  styleUrls: ['./edit-farm-dialog.component.scss']
})
export class EditFarmDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public farm: INewFarmParams) {
  }

  ngOnInit(): void {
  }
}
