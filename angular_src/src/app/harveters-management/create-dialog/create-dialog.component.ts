import { NewHarvesterParams } from './../../app.api';
import {Component, OnInit} from '@angular/core';
import {NewUserParams, UserRole} from '../../app.api';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
  user: NewHarvesterParams;
  confirmPassword = '';
  constructor() { }

  ngOnInit() {
    this.user = new NewHarvesterParams({lastName: '', firstName: ''});

  }

}
