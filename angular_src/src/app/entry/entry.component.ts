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
import {MatSnackBar, MatDialog} from '@angular/material';
import {of} from 'rxjs/observable/of';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {MatTableDataSource} from '@angular/material';
import {ConfirmDeleteEntryDialogComponent} from './confirm-delete-entry-dialog/confirm-delete-entry-dialog.component';

export interface TableList {
  entryNum: number;
  crop: string;
  variety: string;
  recipient: string;
  pounds: number;
  price: number;
}

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit, OnDestroy {

  windowWidth: number = window.innerWidth;
  tableData: TableList[] = [];
  cropName: string;
  orgName: string;
  loading: boolean;

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
  orgTest: OrganizationVm;

  entryToUpdate: EntryVm[];
  selectedCoordinator: HarvesterVm;
  coordinatorId: string;
  harvester: string;
  pounds = 0;
  priceTotal = 0;
  farm: string;
  comment: string;
  hasEntry = false;
  entryCounts = 0;

  doneLoading = false;

  varieties: string[];

  displayedColumns: string[] = ['crop', 'variety', 'recipient', 'pounds', 'price', 'actions'];
  dataSource = new MatTableDataSource<TableList>(this.tableData);
  entryIdArray: any[] = [];

  form: FormGroup;
  editForm: FormGroup;

  constructor(private entryService: EntryClient,
              private farmService: FarmClient,
              private cropService: CropClient,
              private harvesterService: HarvesterClient,
              private organizationService: OrganizationClient,
              private harvestService: HarvestClient,
              private router: Router,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.today = new Date().toLocaleDateString();
    this.harvestStarted = false;
    this.editMode = false;
    this.initForm();

    combineLatest(
      this.farmService.getAll(),
      this.cropService.getAll(),
      this.harvesterService.getAll()
    ).subscribe((data: [FarmVm[], CropVm[], HarvesterVm[]]) => {
      const [farms, crops, harvesters] = data;
      this.farms = farms;
      this.crops = crops;
      this.harvesters = harvesters;
      this.doneLoading = true;
    });

    this.form.get('crop').valueChanges.subscribe(() => {
      this.form.get('pounds').enable();
    });
  }

  initForm() {
    this.form = this.fb.group({
      crop: ['', Validators.required],
      farm: [''],
      variety: [''],
      recipient: [''],
      comment: [''],
      pounds: [{value: null, disabled: true}],
      priceTotal: [{value: 0, disabled: true}]
    });
  }

  ngOnDestroy(): void {
  }

  startHarvest() {
    this.coordinatorId = this.selectedCoordinator._id;
    const newHarvest: HarvestParams = new HarvestParams();
    newHarvest.farmId = this.selectedFarm._id;
    this.harvestService.registerHarvest(newHarvest)
      .mergeMap((harvest: HarvestVm) => {
        this.harvest = harvest;
        this.harvest.entries = [];
        localStorage.setItem('harvest_id', JSON.stringify({harvest: this.harvest._id}));
        this.harvestStarted = true;
        return combineLatest(
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
      }).subscribe((data: [OrganizationVm[]]) => {
      const [organizations] = data;
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
      harvesterId: this.coordinatorId
    });

    this.entryService.registerEntry(newEntry)
      .subscribe((entry: EntryVm) => {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: 'Success', detail: 'Entry Saved! You\'re saving Trees'});
        this.entryIdArray.push(entry._id);
        localStorage.setItem('entry_id', JSON.stringify({
          entries: this.entryIdArray
        }));
        if (!this.hasEntry) {
          this.hasEntry = true;
        }
        this.entryCounts++;
        this.addEntryToTableData();
        this.addFooterToTableData(false);
        this.form.reset();
        this.priceTotal = 0;
        this.pounds = 0;
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

  deleteEntry(entry: TableList, index: number): void {
    const dialogRef = this.matDialog.open(ConfirmDeleteEntryDialogComponent,
      {
        width: '90vw',
        data: entry
      }
    );

    dialogRef.afterClosed().subscribe(
      (confirm: boolean): void => {
        if (confirm) {
          this.loading = true;
          this.entryService.deleteEntry(this.entryIdArray[index]).subscribe (
            (res: any): void => {
              this.entryIdArray.splice(index, 1);
              localStorage.setItem('entry_id', JSON.stringify({
               entries: this.entryIdArray
              }));
              this.tableData.splice(index, 1);
              this.addFooterToTableData(true);
              this.entryCounts--;
              this.loading = false;
              if (this.entryCounts === 0) { this.hasEntry = false; }
                  this.snackBar.open(
                    'Entry deleted',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-success'
                    }
                  );
            },
            (error: Error): void => {
              console.log(error);
              this.loading = false;
              this.snackBar.open(
                'Failed to delete Entry',
                'OK',
                {
                  duration: 2000,
                  panelClass: 'snack-bar-danger'
                }
              );
            }
          );
        }
      }
    );
  }

  submitHarvest() {
    if (!this.hasEntry) {
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
<<<<<<< Updated upstream
    if (!this.cropTest.variety.includes('Unknown')) {
      this.varieties = ['Unknown', ...this.cropTest.variety];
    } else {
      this.varieties = this.cropTest.variety;
    }
=======
    this.cropName = this.cropTest.name;
    this.varieties = this.cropTest.variety;
>>>>>>> Stashed changes
  }

  onPoundChanged() {
    if (this.form.get('pounds').value > 0 && this.cropTest) {
      this.pounds = this.form.get('pounds').value;
      this.priceTotal = parseFloat((this.pounds * this.cropTest.pricePerPound).toFixed());
      this.form.get('priceTotal').setValue(this.priceTotal);
    }
  }

  onRecipientChanged($event) {
    this.orgTest = this.organizations.filter(c => c._id === $event.value)[0];
    this.orgName = this.orgTest.name;
    console.log('Works ' + this.orgName);
  }

  getTotalPounds() {
    return this.tableData.map(t => t.pounds).reduce((acc, value) => acc + value, 0);
  }
  getTotalPrice() {
    return this.tableData.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }

  addEntryToTableData () {
    // remove the previous footer
    this.tableData.splice(-1, 1);
    // add the newest entry
    this.tableData.push(
      {
        entryNum: this.entryCounts,
        crop: this.cropName,
        variety: this.form.get('variety').value,
        recipient: this.orgName,
        pounds: this.form.get('pounds').value,
        price: this.priceTotal
      }
    );
  }

  addFooterToTableData (removePrevious: boolean) {
    if (removePrevious === true) {
      this.tableData.splice(-1, 1);
    }
    this.tableData.push(
      {
        entryNum: this.entryCounts,
        crop: 'Total',
        variety: '',
        recipient: '',
        pounds: this.getTotalPounds(),
        price: this.getTotalPrice(),
      }
    );

    this.dataSource = new MatTableDataSource<TableList>(this.tableData);
  }

}
