import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";

import {User} from "./user";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenericService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = 'app/users';

  loggedInUser: User;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: Http) {
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
    this.redirectUrl = null;
  }

  loggedIn(): boolean {
    return this.loggedInUser != null;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
