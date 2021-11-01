import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeySearchService {
  // public keySearch : any = '';
  public keySearchChange: Subject<any> = new Subject<any>();
  
  constructor() { }

  // get k() {
  //   // return Observable.of(this.keySearch);
  //   // console.log(this.keySearch)
  //   // return of(this.keySearch);
  //   return this.keySearch;
  //   // return true;
  // }

  setKeySearch(keySearch: string) {
    this.keySearchChange.next(keySearch)
    // this.keySearch = keySearch;
  }

  // getKeySearch(): Observable<any> {
  //   // return Observable.of(this.keySearch);
  //   // console.log(this.keySearch)
  //   // return of(this.keySearch);
  //   return this.keySearch;
  //   // return true;
  // }
}
