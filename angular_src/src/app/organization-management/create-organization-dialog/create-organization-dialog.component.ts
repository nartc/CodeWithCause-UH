import {Component, OnInit} from '@angular/core';
import {NewOrganizationParams, OrganizationType} from '../../app.api';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrls: ['./create-organization-dialog.component.scss']
})
export class CreateOrganizationDialogComponent implements OnInit {
  organization: NewOrganizationParams;

  constructor() {
  }

  ngOnInit(): void {
    this.organization = new NewOrganizationParams({orgType: OrganizationType.Purchased, name: ''});
  }

  changed(event: any) {
    this.organization.orgType = event.value;
  }
}
