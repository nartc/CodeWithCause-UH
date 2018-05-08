import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {CropVm} from '../../app.api';

@Component({
  selector: 'app-confirm-delete-crop-dialog',
  templateUrl: './confirm-delete-crop-dialog.component.html',
  styleUrls: ['./confirm-delete-crop-dialog.component.scss']
})
export class ConfirmDeleteCropDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public crop: CropVm) {
  }

  ngOnInit(): void {
  }
}
