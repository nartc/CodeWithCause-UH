import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ConfirmLogoutDialogComponent} from './confirm-logout-dialog/confirm-logout-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  confirmLogout(): void {
    const dialogRef = this.matDialog.open(ConfirmLogoutDialogComponent,
      {
        width: '90vw'
      }
    );

    dialogRef.afterClosed().subscribe(
      (logout: boolean): void => {
        if (logout) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
