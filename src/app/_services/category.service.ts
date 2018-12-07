import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt'
import 'rxjs/add/operator/map';
import { Constants } from './constants';

@Injectable()
export class CategoryService {
  private url: string;

  constructor(private authHttp: AuthHttp) {
    this.url = Constants.URL
  }

  saveCategory(category) {
    return this.authHttp.post(this.url + '/category', category)
      .map(res => res.json());
  }

  getCategories(){
    return this.authHttp.get(this.url + '/category')
      .map(res => res.json());
  }
}
