import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import {handleError} from './error-utils';
import {User} from '../user';

@Injectable()
export class AuthenticationService {
    private token: string;
    private jwtHelper: JwtHelper = new JwtHelper();

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
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
                  // set token property
                    this.token = token;
                  // store jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('id_token', token);
                    let username = this.decodeUsername(token);
                    console.log(`login succeeded. username: ${username}`);
                  // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch(handleError);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('id_token');
    }

    loggedIn(): boolean {
        return tokenNotExpired();
    }

    private decodeUsername(token) : string {
      let decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.username;
    }

    getToken(): string {
        return this.token;
    }

    getLoggedInUsername(): string {
        let token = localStorage.getItem('id_token');
        return this.decodeUsername(token);
    }
}
