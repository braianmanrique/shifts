import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt'
import 'rxjs/add/operator/map';
import { Constants } from './constants';

@Injectable()
export class RoleService {
  public url: string;

  constructor(private authHttp: AuthHttp) {
    this.url = Constants.URL
  }

  getRoles(){
    return this.authHttp.get(this.url + '/role')
      .map(res => res.json());
  }
}
