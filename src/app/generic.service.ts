import {Injectable}      from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {User} from './user';
import {InMemoryDataService} from './in-memory-data.service';

@Injectable()
export class GenericService {

    private usersUrl = 'app/users';

    loggedInUser: User;

    constructor(private http: Http) {
    }


    getUsers(): Promise<User[]> {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then(response => response.json().data as User[])
            .catch(this.handleError);
    }

    getUser(id: number): Promise<User> {
        return this.getUsers()
            .then(users => users.find(user => user.id === id));
    }

    private getLoginUser(username: string): Promise<User> {
        return this.getUsers()
            .then(users => users.find(user => user.username === username));
    }

    login(username: string, password: string): Promise<User> {
        return this.getLoginUser(username).then(user => {
            if (user && user.password === password) {
                this.loggedInUser = user;
                return user;
            } else {
                throw new Error(`Either the username ${username} is unknown or the password is invalid!`);
            }
        });
    }

    logout(): void {
        this.loggedInUser = null;
    }

    loggedIn(): boolean {
        return this.loggedInUser != null;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


}
