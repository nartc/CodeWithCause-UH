import { HarvesterVm } from './../../app.api';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public user: HarvesterVm) {
  }


  ngOnInit() {
  }

}
