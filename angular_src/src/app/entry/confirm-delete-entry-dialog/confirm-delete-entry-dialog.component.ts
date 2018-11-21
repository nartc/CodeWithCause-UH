import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {TableList} from '../entry.component';

@Component({
  selector: 'app-confirm-delete-entry-dialog',
  templateUrl: './confirm-delete-entry-dialog.component.html',
  styleUrls: ['./confirm-delete-entry-dialog.component.scss']
})
export class ConfirmDeleteEntryDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public entry: TableList) { }

  ngOnInit() {
  }

}
