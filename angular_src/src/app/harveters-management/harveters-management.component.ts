import { HarvesterVm, HarvesterClient, NewHarvesterParams } from './../app.api';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
// import {EditUserDialogComponent} from './edit-user-dialog/edit-user-dialog.component';
import {CreateDialogComponent} from './create-dialog/create-dialog.component';
import {ConfirmDeleteComponent} from './confirm-delete/confirm-delete.component';
import 'rxjs/add/operator/mergeMap';
import {NewUserParams, UserClient, UserVm} from '../app.api';

@Component({
  selector: 'app-harveters-management',
  templateUrl: './harveters-management.component.html',
  styleUrls: ['./harveters-management.component.scss']
})
export class HarvetersManagementComponent implements OnInit {
  token: string;
  users: Array<HarvesterVm>; 
  loading: boolean;

  constructor(private harvesterService: HarvesterClient,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar) {
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
this.token = currentUser.token;
// harvesterService.configuration = new Configuration({
//   apiKeys: {
//     Authorization: this.token
//   }
// });
}

  ngOnInit() {
    this.loading = true;
    this.harvesterService.getAll().subscribe(
      (users: Array<HarvesterVm>): void => {
        this.users = users;
        this.loading = false;
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
        this.snackBar.open(
          'Failed to fetch users',
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
    // this.harvesterService.configuration.apiKeys['Authorization'] = null;
  }
  createNewUser(): void {
    const dialogRef = this.matDialog.open(CreateDialogComponent,
      {
        width: '90vw'
      }
    );

    dialogRef.afterClosed().subscribe(
      (newUser: NewHarvesterParams): void => {
        if (newUser) {
          this.loading = true;
          this.harvesterService.registerHarvester(newUser).subscribe(
            (response: any): void => {
              this.harvesterService.getAll().subscribe(
                (users: Array<HarvesterVm>): void => {
                  this.users = users;
                  this.loading = false;
                  this.snackBar.open(
                    'User created',
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
                    'Failed to fetch users',
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
                'Failed to create user',
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
  deleteUser(user: HarvesterVm): void {
    const dialogRef = this.matDialog.open(ConfirmDeleteComponent,
      {
        width: '90vw',
        data: user
      }
    );

    dialogRef.afterClosed().subscribe(
      (confirm: boolean): void => {
        if (confirm) {
          this.loading = true;
          this.harvesterService.deleteHarvesterById(user._id).subscribe(
            (response: any): void => {
              this.harvesterService.getAll().subscribe(
                (users: Array<HarvesterVm>): void => {
                  this.users = users;
                  this.loading = false;
                  this.snackBar.open(
                    'User deleted',
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
                    'Failed to fetch users',
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
                'Failed to delete user',
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

  // editUser(user: HarvesterVm): void {
  //   const dialogRef = this.matDialog.open(EditUserDialogComponent,
  //     {
  //       width: '90vw',
  //       data: user
  //     }
  //   );

  //   dialogRef.afterClosed().subscribe(
  //     (updatedUser: NewUserParams): void => {
  //       if (updatedUser) {
  //         this.loading = true;
  //         this.harvesterService.(user._id, updatedUser).subscribe(
  //           (response: any): void => {
  //             this.systemService.getAllUsers().subscribe(
  //               (users: Array<UserVm>): void => {
  //                 this.users = users;
  //                 this.loading = false;
  //                 this.snackBar.open(
  //                   'User updated',
  //                   'OK',
  //                   {
  //                     duration: 2000,
  //                     panelClass: 'snack-bar-success'
  //                   }
  //                 );
  //               },
  //               (error: Error): void => {
  //                 console.error(error);
  //                 this.loading = false;
  //                 this.snackBar.open(
  //                   'Failed to fetch users',
  //                   'OK',
  //                   {
  //                     duration: 2000,
  //                     panelClass: 'snack-bar-danger'
  //                   }
  //                 );
  //               }
  //             );
  //           },
  //           (error: Error): void => {
  //             console.error(error);
  //             this.loading = false;
  //             this.snackBar.open(
  //               'Failed to update user',
  //               'OK',
  //               {
  //                 duration: 2000,
  //                 panelClass: 'snack-bar-danger'
  //               }
  //             );
  //           }
  //         );
  //       }
  //     }
  //   );
  // }

}
