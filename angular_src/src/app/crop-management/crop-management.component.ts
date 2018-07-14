import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateCropDialogComponent} from './create-crop-dialog/create-crop-dialog.component';
import {ConfirmDeleteCropDialogComponent} from './confirm-delete-crop-dialog/confirm-delete-crop-dialog.component';
import {EditCropDialogComponent} from './edit-crop-dialog/edit-crop-dialog.component';
import {FormGroup} from '@angular/forms';
import {CropClient, CropVm, NewCropParams, SystemClient} from '../app.api';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-crop-management',
  templateUrl: './crop-management.component.html',
  styleUrls: ['./crop-management.component.scss']
})
export class CropManagementComponent implements OnInit, OnDestroy {
  token: string;
  crops: Array<CropVm> = [];
  loading: boolean;

  constructor(private cropService: CropClient,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private systemService: SystemClient) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token;
  }

  ngOnInit(): void {
    this.loading = true;
    this.cropService.getAll().subscribe(
      (crops: Array<CropVm>): void => {
        this.crops = crops;
        this.loading = false;
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
        this.snackBar.open(
          'Failed to fetch crops',
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
    // this.cropService.configuration.apiKeys['Authorization'] = null;
  }

  onSelectFile(event): void {
    const file = event.target.files[0];
    this.loading = false;
    this.systemService.uploadFile(file)
      .mergeMap(() => {
        return this.systemService.importCrops();
      })
      .subscribe((data) => {
        this.loading = true;
      });
  }

  createNewCrop(): void {
    const dialogRef = this.matDialog.open(CreateCropDialogComponent,
      {
        width: '90vw'
      }
    );

    dialogRef.afterClosed().subscribe(
      (cropForm: FormGroup): void => {
        if (cropForm) {
          this.loading = true;
          const varieties: string[] = [];
          for (const i in cropForm.value.varieties) {
            varieties.push(cropForm.value.varieties[i].variety);
          }
          const newCrop: NewCropParams = new NewCropParams({
            name: cropForm.value.name,
            variety: varieties,
            pricePerPound: cropForm.value.pricePerPound
          });
          this.cropService.registerCrop(newCrop).subscribe(
            (response: any): void => {
              this.cropService.getAll().subscribe(
                (crops: Array<CropVm>): void => {
                  this.crops = crops;
                  this.loading = false;
                  this.snackBar.open(
                    'New crop created',
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
                    'Failed to fetch crops',
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
                'Failed to create new crop',
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

  deleteCrop(crop: CropVm): void {
    const dialogRef = this.matDialog.open(ConfirmDeleteCropDialogComponent,
      {
        width: '90vw',
        data: crop
      }
    );

    dialogRef.afterClosed().subscribe(
      (confirm: boolean): void => {
        if (confirm) {
          this.loading = true;
          this.cropService.deleteCrop(crop._id).subscribe(
            (response: any): void => {
              this.cropService.getAll().subscribe(
                (crops: Array<CropVm>): void => {
                  this.crops = crops;
                  this.loading = false;
                  this.snackBar.open(
                    'Crop deleted',
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
                    'Failed to fetch crops',
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
                'Failed to delete crop',
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

  editCrop(crop: CropVm): void {
    const dialogRef = this.matDialog.open(EditCropDialogComponent,
      {
        width: '90vw',
        data: crop
      }
    );
    dialogRef.afterClosed().subscribe(
      (cropForm: FormGroup): void => {
        if (cropForm) {
          this.loading = true;
          const varieties: string[] = [];
          for (const i in cropForm.value.varieties) {
            varieties.push(cropForm.value.varieties[i].variety);
          }
          const updatedCrop: NewCropParams = new NewCropParams({
            name: cropForm.value.name,
            variety: varieties,
            pricePerPound: cropForm.value.pricePerPound
          });
          this.cropService.updateCrop(crop._id, updatedCrop).subscribe(
            (response: any): void => {
              this.cropService.getAll().subscribe(
                (crops: Array<CropVm>): void => {
                  this.crops = crops;
                  this.loading = false;
                  this.snackBar.open(
                    'Crop updated',
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
                    'Failed to fetch crops',
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
                'Failed to update crop',
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
