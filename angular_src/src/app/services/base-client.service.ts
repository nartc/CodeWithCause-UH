import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class BaseClient {

  token: string;

  constructor() {
    this.token = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')).token
      : '';
  }

  public transformOptions(options: any): any {
    if (this.token) {
      const headers = <HttpHeaders>options.headers;
      options.headers = headers.append('Authorization', this.token);
    }

    return new Promise(resolve => {
      resolve(options);
    });
  }

}
