import {Component} from '@angular/core';
import {UserVm} from './app.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Code With A Cause';
  user: UserVm;
}
