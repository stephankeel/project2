import {Injectable} from "@angular/core";
import {Headers, RequestOptions, Http} from "@angular/http";
import {User} from "../user";
import 'rxjs/add/operator/toPromise';
import {AuthenticationService} from './authentication.service';
import {handleError} from './error-utils';

@Injectable()
export class UserService {

    private usersUrl = '/api/users';

    constructor(private http: Http, private authenticationService: AuthenticationService) {
    }

    addUser(user: User): Promise<User> {
        return this.http
            .post(this.usersUrl, JSON.stringify(user), this.createAuthHeader())
            .map(response => response.json().data as User)
            .catch(handleError)
            .toPromise()
    }

    updateUser(user: User): Promise<User> {
        const url = `${this.usersUrl}/${user.id}`;
        return this.http
            .put(url, JSON.stringify(user), this.createAuthHeader())
            .map(response => response.json().data as User)
            .catch(handleError)
            .toPromise()
    }

    deleteUser(user: User): Promise<User> {
        const url = `${this.usersUrl}/${user.id}`;
        return this.http
            .delete(url, this.createAuthHeader())
            .map(response => response.json().data as String)
            .catch(handleError)
            .toPromise()
    }

    getUsers(): Promise<User[]> {
        let users = this.http.get(this.usersUrl, this.createAuthHeader())
            .map(response => response.json().data as User[])
            .catch(handleError)
            .toPromise()
        return users;
    }

    getUser(id: number): Promise<User> {
        const url = `${this.usersUrl}/${id}`;
        return this.http.get(url, this.createAuthHeader())
            .map(response => response.json().data as User)
            .catch(handleError)
            .toPromise()
    }

    /*
     private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
     }
     */
    private createAuthHeader() {
        // add authorization header with jwt token
        let headers = new Headers({
            'Authorization': this.authenticationService.getToken(),
            'Content-Type': 'application/json'
        });
        return new RequestOptions({headers: headers});
    }
}
