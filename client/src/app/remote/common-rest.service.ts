import {Injectable} from '@angular/core';
import {handleError} from './error-utils';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs';
import {Info} from "./info";

@Injectable()
export class CommonRestService {

  constructor(private authHttp: AuthHttp) { }

  getInfo(): Observable<Info> {
    return this.authHttp
      .get('/api/info')
      .map(response => {
        let info: Info = response.json()
        return info;
      }).catch(handleError);
  }

}
