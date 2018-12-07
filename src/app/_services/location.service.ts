import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt'
import 'rxjs/add/operator/map';
import { Constants } from './constants';

@Injectable()
export class LocationService {
  public url: string;

  constructor(private authHttp: AuthHttp) {
    this.url = Constants.URL
  }

  saveLocation(location) {
    return this.authHttp.post(this.url + '/location', location)
      .map(res => res.json());
  }

  getLocations(){
    return this.authHttp.get(this.url + '/location')
      .map(res => res.json());
  }

}
