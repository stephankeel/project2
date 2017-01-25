import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {tokenNotExpired, JwtHelper} from 'angular2-jwt';
import {UserType} from '../user';

import {handleError} from './error-utils';
import {User} from '../user';

@Injectable()
export class AuthenticationService {
  private jwtHelper: JwtHelper = new JwtHelper();

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post('/api/authenticate', JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token: string = response.json() && response.json().token as string;
        if (token) {
          // store jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('id_token', token);
          console.log(`login succeeded. username: ${this.decodeUsername(token)}`);
          return true;
        } else {
          return false;
        }
      })
      .catch(handleError);
  }

  logout(): void {
    localStorage.removeItem('id_token');
  }

  loggedIn(): boolean {
    return tokenNotExpired();
  }

  private decodeUsername(token): string {
    let decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.username;
  }

  getToken(): string {
    return localStorage.getItem('id_token');
  }

  getLoggedInUsername(): string {
    return this.decodeUsername(this.getToken());
  }

  getLoggedInUserId(): any {
    let decodedToken = this.jwtHelper.decodeToken(this.getToken());
    return decodedToken.id;
  }

  getLoggedInUserType(): UserType {
    let decodedToken = this.jwtHelper.decodeToken(this.getToken());
    return decodedToken.userType;
  }
}
