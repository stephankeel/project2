import {Injectable} from "@angular/core";
import {Headers, RequestOptions, Http} from "@angular/http";
import {User} from "../user";
import 'rxjs/add/operator/toPromise';
import { LoginService } from './login.service';

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = '/api/users';

  constructor(private http: Http, private loginService: LoginService) {
  }

  addUser(user: User): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  updateUser(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  deleteUser(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  getUsers(): Promise<User[]> {
    let users = this.http.get(this.usersUrl, this.createAuthHeader(this.loginService.token))
      .toPromise()
      .then(response => response.json().data as User[])
      .catch(this.handleError);
    return users;
  }

  getUser(id: number): Promise<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get(url, this.createAuthHeader(this.loginService.token))
      .toPromise()
      .then(response => response.json().data as User)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private createAuthHeader(token: string) {
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.loginService.token });
    return new RequestOptions({ headers: headers });
  }
}
