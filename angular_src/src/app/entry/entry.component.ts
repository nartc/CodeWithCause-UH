import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from 'primeng/api';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/observable/combineLatest';
import {
  CropClient,
  CropVm,
  EntryClient,
  EntryVm,
  FarmClient,
  FarmVm,
  HarvestClient,
  HarvesterClient,
  HarvesterVm,
  HarvestParams,
  HarvestVm,
  NewEntryParams,
  OrganizationClient,
  OrganizationVm,
  SwaggerException,
} from '../app.api';
import {MatSlider, MatSnackBar} from '@angular/material';
import {of} from 'rxjs/observable/of';
import {combineLatest} from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit, OnDestroy {
  @ViewChild('slider') slider: MatSlider;

  today: string;
  harvestStarted: boolean;
  editMode: boolean;
  msgs: Message[] = [];

  // dropdown lists
  farms: FarmVm[] = [];
  organizations: OrganizationVm[];
  crops: CropVm[];
  variety: any[] = [];
  harvesters: HarvesterVm[];
  selectedFarm: FarmVm;
  harvest: HarvestVm;
  cropTest: CropVm;


  harvester: string;
  pounds = 0;
  priceTotal = 0;
  farm: string;
  comment: string;
  firstEntry = false;
  entryCounts = 0;

  doneLoading = false;

  varieties: string[];

  entryIdArray: any[] = [];

  form: FormGroup;

  constructor(private entryService: EntryClient,
              private farmService: FarmClient,
              private cropService: CropClient,
              private harvesterService: HarvesterClient,
              private organizationService: OrganizationClient,
              private harvestService: HarvestClient,
              private router: Router,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.today = new Date().toLocaleDateString();
    this.harvestStarted = false;
    this.editMode = false;
    this.initForm();

    combineLatest(
      this.farmService.getAll(),
      this.cropService.getAll()
    ).subscribe((data: [FarmVm[], CropVm[]]) => {
      const [farms, crops] = data;
      this.farms = farms;
      this.crops = crops;
      this.doneLoading = true;
    });

    this.form.get('crop').valueChanges.subscribe(() => {
      this.form.get('pounds').enable();
    });
  }

  initForm() {
    this.form = this.fb.group({
      crop: ['', Validators.required],
      harvester: [''],
      farm: [''],
      variety: [''],
      recipient: [''],
      comment: [''],
      pounds: [{value: 0, disabled: true}],
      priceTotal: [{value: 0, disabled: true}]
    });
  }

  ngOnDestroy(): void {
  }

  startHarvest() {
    const newHarvest: HarvestParams = new HarvestParams();
    newHarvest.farmId = this.selectedFarm._id;
    this.harvestService.registerHarvest(newHarvest)
      .mergeMap((harvest: HarvestVm) => {
        this.harvest = harvest;
        this.harvest.entries = [];
        localStorage.setItem('harvest_id', JSON.stringify({harvest: this.harvest._id}));
        this.harvestStarted = true;
        return combineLatest(
          this.harvesterService.getAll(),
          this.organizationService.getAll(),
        );
      })
      .catch((err: SwaggerException) => {
        let msg = 'Server error occurred';
        if (err) {
          msg = JSON.parse(err.response).message;
        }

        this.snackBar.open(
          `Failed to begin harvest: ${msg}`,
          'OK',
          {
            duration: 3000,
            panelClass: 'snack-bar-danger'
          }
        );
        return of();
      }).subscribe((data: [HarvesterVm[], OrganizationVm[]]) => {
      const [harvesters, organizations] = data;
      this.harvesters = harvesters;
      this.organizations = organizations;
    });

  }

  submitEntry() {
    const newEntry: NewEntryParams = new NewEntryParams({
      cropId: this.form.get('crop').value,
      selectedVariety: this.form.get('variety').value,
      recipientId: this.form.get('recipient').value,
      pounds: this.form.get('pounds').value,
      comments: this.form.get('comment').value,
      harvesterId: this.form.get('harvester').value
    });

    this.entryService.registerEntry(newEntry)
      .subscribe((entry: EntryVm) => {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: 'Success', detail: 'Entry Saved! You\'re saving Trees'});
        this.entryIdArray.push(entry._id);
        localStorage.setItem('entry_id', JSON.stringify({
          entries: this.entryIdArray
        }));
        if (!this.firstEntry) {
          this.firstEntry = true;
        }
        this.entryCounts++;
        this.form.reset();
        this.priceTotal = 0;
        this.pounds = 0;
        this.slider.value = 0;
      }, (err: SwaggerException) => {
        let msg = 'Server error occurred';
        if (err) {
          msg = JSON.parse(err.response).message;
        }

        this.snackBar.open(
          `Failed to submit entry: ${msg}`,
          'OK',
          {
            duration: 3000,
            panelClass: 'snack-bar-danger'
          }
        );
        return of();
      });
  }

  submitHarvest() {
    if (!this.firstEntry) {
      return;
    }

    const harvestId = JSON.parse(localStorage.getItem('harvest_id'));
    const entryId = JSON.parse(localStorage.getItem('entry_id'));

    const harvestParams: HarvestParams = new HarvestParams({
      farmId: this.selectedFarm._id,
      entriesIds: entryId.entries,
      harvestId: harvestId.harvest
    });
    this.harvestService.registerHarvest(harvestParams)
      .subscribe(data => {
          this.router.navigate([`/review-harvest/${harvestId.harvest}`]);
        },
        (err) => {
          let msg = 'Server error occurred';
          if (err) {
            msg = JSON.parse(err.response).message;
          }

          this.snackBar.open(
            `Failed to submit harvest: ${msg}`,
            'OK',
            {
              duration: 3000,
              panelClass: 'snack-bar-danger'
            }
          );
          return of();
        });
  }

  onCropChanged($event) {
    this.cropTest = this.crops.filter(c => c._id === $event.value)[0];
    if (!this.cropTest.variety.includes('Unknown')) {
      this.varieties = ['Unknown', ...this.cropTest.variety];
    } else {
      this.varieties = this.cropTest.variety;
    }
  }

  onPoundChanged($event) {
    if ($event.value > 0 && this.cropTest) {
      this.pounds = $event.value;
      this.priceTotal = parseFloat((this.pounds * this.cropTest.pricePerPound).toFixed());
      this.form.get('priceTotal').setValue(this.priceTotal);
    }
  }
}
