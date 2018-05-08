import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {EditUserDialogComponent} from './edit-user-dialog/edit-user-dialog.component';
import {CreateUserDialogComponent} from './create-user-dialog/create-user-dialog.component';
import {ConfirmDeleteUserDialogComponent} from './confirm-delete-user-dialog/confirm-delete-user-dialog.component';
import 'rxjs/add/operator/mergeMap';
import {NewUserParams, UserClient, UserVm} from '../app.api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  token: string;
  users: Array<UserVm>;
  loading: boolean;

  constructor(private systemService: UserClient,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token;
    // systemService.configuration = new Configuration({
    //   apiKeys: {
    //     Authorization: this.token
    //   }
    // });
  }

  ngOnInit(): void {
    this.loading = true;
    this.systemService.getAllUsers().subscribe(
      (users: Array<UserVm>): void => {
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
    // this.systemService.configuration.apiKeys['Authorization'] = null;
  }

  createNewUser(): void {
    const dialogRef = this.matDialog.open(CreateUserDialogComponent,
      {
        width: '90vw'
      }
    );

    dialogRef.afterClosed().subscribe(
      (newUser: NewUserParams): void => {
        if (newUser) {
          this.loading = true;
          this.systemService.registerUser(newUser).subscribe(
            (response: any): void => {
              this.systemService.getAllUsers().subscribe(
                (users: Array<UserVm>): void => {
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

  deleteUser(user: UserVm): void {
    const dialogRef = this.matDialog.open(ConfirmDeleteUserDialogComponent,
      {
        width: '90vw',
        data: user
      }
    );

    dialogRef.afterClosed().subscribe(
      (confirm: boolean): void => {
        if (confirm) {
          this.loading = true;
          this.systemService.deleteUserById(user._id).subscribe(
            (response: any): void => {
              this.systemService.getAllUsers().subscribe(
                (users: Array<UserVm>): void => {
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

  editUser(user: UserVm): void {
    const dialogRef = this.matDialog.open(EditUserDialogComponent,
      {
        width: '90vw',
        data: user
      }
    );

    dialogRef.afterClosed().subscribe(
      (updatedUser: NewUserParams): void => {
        if (updatedUser) {
          this.loading = true;
          this.systemService.udpateUserById(user._id, updatedUser).subscribe(
            (response: any): void => {
              this.systemService.getAllUsers().subscribe(
                (users: Array<UserVm>): void => {
                  this.users = users;
                  this.loading = false;
                  this.snackBar.open(
                    'User updated',
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
                'Failed to update user',
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
