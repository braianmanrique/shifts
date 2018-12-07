import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt'
import { RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from './constants';

@Injectable()
export class ScheduleService {
  public url: string;

  constructor(private authHttp: AuthHttp) {
    this.url = Constants.URL;
  }

  saveSchedule(schedule) {
    return this.authHttp.post(this.url + '/schedule', schedule)
      .map(res => res.json());
  }

  getPersonsSchedules(query:any = {}) {
    let params = new URLSearchParams();
    for(let key in query){
      if(query[key]){
        params.append(key.toString(),query[key].toString());
      }
    }	
    let options = new RequestOptions({
      params:params
    });
    let requestOptions = new RequestOptions();
    return this.authHttp.get(this.url + '/schedule/hours', options)
      .map(res => res.json());
  }
}
