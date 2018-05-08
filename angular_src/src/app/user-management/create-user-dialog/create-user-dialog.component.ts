import {Component, OnInit} from '@angular/core';
import {NewUserParams, UserRole} from '../../app.api';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit {
  user: NewUserParams;
  confirmPassword = '';

  constructor() {
  }

  ngOnInit(): void {
    this.user = new NewUserParams({username: '', password: '', role: UserRole.User});
  }

  changed(event: any) {
    // this.user.role = event.value;
  }
}
