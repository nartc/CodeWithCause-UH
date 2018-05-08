import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateFarmDialogComponent} from './create-farm-dialog/create-farm-dialog.component';
import {ConfirmDeleteFarmDialogComponent} from './confirm-delete-farm-dialog/confirm-delete-farm-dialog.component';
import {EditFarmDialogComponent} from './edit-farm-dialog/edit-farm-dialog.component';
import {FarmClient, FarmVm, NewFarmParams} from '../app.api';

@Component({
  selector: 'app-farm-management',
  templateUrl: './farm-management.component.html',
  styleUrls: ['./farm-management.component.scss']
})
export class FarmManagementComponent implements OnInit, OnDestroy {
  token: string;
  farms: Array<FarmVm>;
  loading: boolean;

  constructor(private farmService: FarmClient,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token;

    this.farms = [];
  }

  ngOnInit(): void {
    this.loading = true;
    this.farmService.getAll().subscribe(
      (farms: Array<FarmVm>): void => {
        this.farms = farms;
        this.loading = false;
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
        this.snackBar.open(
          'Failed to fetch farms',
          'OK',
          {
            duration: 2000,
            panelClass: 'snack-bar-danger'
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    // this.farmService.configuration.apiKeys['Authorization'] = null;
  }

  createNewFarm(): void {
    const dialogRef = this.matDialog.open(CreateFarmDialogComponent,
      {
        width: '90vw'
      }
    );

    dialogRef.afterClosed().subscribe(
      (newFarm: NewFarmParams): void => {
        if (newFarm) {
          this.loading = true;
          this.farmService.registerFarm(newFarm).subscribe(
            (response: any): void => {
              this.farmService.getAll().subscribe(
                (farms: Array<FarmVm>): void => {
                  this.farms = farms;
                  this.loading = false;
                  this.snackBar.open(
                    'New farm created',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-success'
                    }
                  );
                },
                (error: Error): void => {
                  console.error(error);
                  this.loading = false;
                  this.snackBar.open(
                    'Failed to fetch farms',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-danger'
                    }
                  );
                }
              );
            },
            (error: Error): void => {
              console.error(error);
              this.loading = false;
              this.snackBar.open(
                'Failed to create new farm',
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

  deleteFarm(farm: FarmVm): void {
    const dialogRef = this.matDialog.open(ConfirmDeleteFarmDialogComponent,
      {
        width: '90vw',
        data: farm
      }
    );

    dialogRef.afterClosed().subscribe(
      (confirm: boolean): void => {
        if (confirm) {
          this.loading = true;
          this.farmService.deleteById(farm._id).subscribe(
            (response: any): void => {
              this.farmService.getAll().subscribe(
                (farms: Array<FarmVm>): void => {
                  this.farms = farms;
                  this.loading = false;
                  this.snackBar.open(
                    'Farm deleted',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-success'
                    }
                  );
                },
                (error: Error): void => {
                  console.error(error);
                  this.loading = false;
                  this.snackBar.open(
                    'Failed to fetch farms',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-danger'
                    }
                  );
                }
              );
            },
            (error: Error): void => {
              console.error(error);
              this.loading = false;
              this.snackBar.open(
                'Failed to delete farm',
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

  editFarm(farm: FarmVm): void {
    const dialogRef = this.matDialog.open(EditFarmDialogComponent,
      {
        width: '90vw',
        data: farm
      }
    );

    dialogRef.afterClosed().subscribe(
      (updatedFarm: NewFarmParams): void => {
        if (updatedFarm) {
          this.loading = true;
          this.farmService.updateById(farm._id, updatedFarm).subscribe(
            (response: any): void => {
              this.farmService.getAll().subscribe(
                (farms: Array<FarmVm>): void => {
                  this.farms = farms;
                  this.loading = false;
                  this.snackBar.open(
                    'Farm updated',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-success'
                    }
                  );
                },
                (error: Error): void => {
                  console.error(error);
                  this.loading = false;
                  this.snackBar.open(
                    'Failed to fetch farms',
                    'OK',
                    {
                      duration: 2000,
                      panelClass: 'snack-bar-danger'
                    }
                  );
                }
              );
            },
            (error: Error): void => {
              console.error(error);
              this.loading = false;
              this.snackBar.open(
                'Failed to update farm',
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
}
