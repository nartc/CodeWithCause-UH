import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {INewOrganizationParams} from '../../app.api';

@Component({
  selector: 'app-edit-organization-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrls: ['./edit-organization-dialog.component.scss']
})
export class EditOrganizationDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public organization: INewOrganizationParams) {
  }

  ngOnInit(): void {
  }

  changed(event: any) {
    // this.organization.orgType = event.value;
  }
}
