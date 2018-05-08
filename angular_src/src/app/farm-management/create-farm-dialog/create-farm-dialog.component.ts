import {Component, OnInit} from '@angular/core';
import {NewFarmParams} from '../../app.api';

@Component({
  selector: 'app-create-farm-dialog',
  templateUrl: 'create-farm-dialog.component.html',
  styleUrls: ['./create-farm-dialog.component.scss']
})
export class CreateFarmDialogComponent implements OnInit {
  farm: NewFarmParams;

  constructor() {
  }

  ngOnInit(): void {
    this.farm = new NewFarmParams({name: '', lat: 0, lng: 0});
  }
}
