import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from './constants';

@Injectable()
export class LoginService {
  public url: string;

    constructor(private http: Http) {
      this.url = Constants.URL;
    }

    login(user) {
      return this.http.post(this.url + '/login', user)
        .map(res => res.json());
    }

}
