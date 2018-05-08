import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {OrganizationVm} from '../../app.api';

@Component({
  selector: 'app-confirm-delete-organization-dialog',
  templateUrl: './confirm-delete-organization-dialog.component.html',
  styleUrls: ['./confirm-delete-organization-dialog.component.scss']
})
export class ConfirmDeleteOrganizationDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public organization: OrganizationVm) {
  }

  ngOnInit() {
  }
}
