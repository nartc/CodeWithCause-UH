import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {INewUserParams, UserRole} from '../../app.api';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {

  userRole = UserRole;

  constructor(@Inject(MAT_DIALOG_DATA) public user: INewUserParams) {
  }

  ngOnInit(): void {
  }

  changed(event: any) {
    this.user.role = event.value;
  }
}
