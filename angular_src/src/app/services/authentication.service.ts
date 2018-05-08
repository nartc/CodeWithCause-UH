import {EventEmitter, Injectable, Output} from '@angular/core';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {LoginParams, LoginVm, UserClient, UserRole} from '../app.api';

@Injectable()
export class AuthenticationService {

  // Used for showing/hiding certain elements based upon the user group
  @Output() getAdmin: EventEmitter<any> = new EventEmitter();

  // Used for routing to correct profile link in navbar
  @Output() getUsername: EventEmitter<any> = new EventEmitter();

  public token: string;

  // Used for showing the navbar when logged in and hiding it when logged out
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient,
              private userClient: UserClient,
              private snackBar: MatSnackBar) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

    if (currentUser) {
      this.loggedIn.next(true);
    }
  }

  login(username: string, password: string) {
    return this.userClient.login(new LoginParams({username, password}))
      .map((response: LoginVm) => {
      // login successful if there's a jwt token in the response
      const token = response && response.authToken;
      const role = response && response.role;
      let admin = false;
      username = response && response.username;

      if (role === UserRole.Admin) {
        admin = true;
      }

      this.getAdmin.emit(admin);

      // set token property
      this.token = token;

      // store username and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify({
        username: username,
        token: token,
        admin: admin
      }));

      // Used to show navbar
      this.loggedIn.next(true);

      this.getUsername.emit(username);
    });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    const wasLoggedIn: boolean = this.loggedIn.getValue();
    this.loggedIn.next(false);
    this.getUsername.emit('');
    this.getAdmin.emit(false);
    this.token = null;
    localStorage.removeItem('currentUser');

    if (wasLoggedIn) {
      this.snackBar.open(
        'Logout successful',
        'OK',
        {
          duration: 2000,
          panelClass: 'snack-bar-success'
        }
      );
    }
  }
}
