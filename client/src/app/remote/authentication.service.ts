import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

import {handleError} from './error-utils';
import {User} from '../user';

@Injectable()
export class AuthenticationService {
    private token: string;
    private loggedInUserId: number;
    private loggedInUser: User;

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.loggedInUserId = currentUser && currentUser.userId;
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post('/api/authenticate', JSON.stringify({
            username: username,
            password: password
        }), {headers: this.headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token: string = response.json() && response.json().token as string;
                let user: User =  response.json() && response.json().data as User;
                console.log(`login succeeded. Token: ${token}, user: ${user.firstname} ${user.lastname}`);
                if (token) {
                    // set token property
                    this.token = token;
                    this.loggedInUser = user;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({userId: 1, token: token}));

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
        localStorage.removeItem('currentUser');
        this.loggedInUser = null;
    }

    loggedIn(): boolean {
        return this.token != null;
    }

    getToken(): string {
        return this.token;
    }

    getLoggedInUser(): User {
        return this.loggedInUser;
    }
}
