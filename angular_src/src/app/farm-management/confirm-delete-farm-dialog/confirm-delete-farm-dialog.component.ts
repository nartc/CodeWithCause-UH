import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FarmVm} from '../../app.api';

@Component({
  selector: 'app-confirm-delete-farm-dialog',
  templateUrl: './confirm-delete-farm-dialog.component.html',
  styleUrls: ['./confirm-delete-farm-dialog.component.scss']
})
export class ConfirmDeleteFarmDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public farm: FarmVm) {
  }

  ngOnInit(): void {
  }
}
