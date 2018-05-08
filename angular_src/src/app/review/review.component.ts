import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EntryVm, HarvestClient, HarvestVm} from '../app.api';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
  token: string;
  harvest: HarvestVm;

  constructor(public _activatedRoute: ActivatedRoute,
              private harvestService: HarvestClient) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token;
  }

  harvestId: string;
  entries: EntryVm[];
  doneLoading = false;
  today: Date;

  ngOnInit(): void {
    this.today = new Date(Date.now());
    // Get Crops and Harvesters
    this.harvestId = this._activatedRoute.snapshot.params['id'];
    this.harvestService.getHarvestById(this.harvestId)
      .subscribe((data: HarvestVm) => {
        this.entries = data.entries;
        this.doneLoading = true;
      });
  }

  ngOnDestroy(): void {
  }
}
