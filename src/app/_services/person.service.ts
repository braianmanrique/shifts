import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt'
import 'rxjs/add/operator/map';
import { Constants } from './constants';

@Injectable()
export class PersonService {
  public url: string;

  constructor(private authHttp: AuthHttp) {
    this.url = Constants.URL;
  }

  savePerson(person) {
    console.log("Person que se enviara como body : " + person);
    return this.authHttp.post(this.url + '/person', person)
      .map(res => res.json());
  }

  getPersons(idlocation, idcategory){
    return this.authHttp.get( this.url + '/persons', { params: {location: idlocation, category: idcategory} } )
      .map(res => res.json());
  }
}
