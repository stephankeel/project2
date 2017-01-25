import {Injectable} from "@angular/core";
import {User} from "../user";
import 'rxjs/add/operator/toPromise';
import {handleError} from './error-utils';
import {AuthHttp} from 'angular2-jwt';
import {RequestContainer} from "../../../../server/wire/com-container";

@Injectable()
export class UserService {

  private usersUrl = '/api/users';

  constructor(private authHttp: AuthHttp) {
  }

  addUser(user: User): Promise<User> {
    let container: RequestContainer<User> = new RequestContainer<User>(null, user);
    return this.authHttp
      .post(this.usersUrl, JSON.stringify(container))
      .map(response => response.json().content as User)
      .catch(handleError)
      .toPromise()
  }

  updateUser(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    let container: RequestContainer<User> = new RequestContainer<User>(null, user);
    return this.authHttp
      .put(url, JSON.stringify(container))
      .map(response => response.json().content as User)
      .catch(handleError)
      .toPromise()
  }

  deleteUser(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.authHttp
      .delete(url)
      .map(response => response.json().content as String)
      .catch(handleError)
      .toPromise()
  }

  getUsers(): Promise<User[]> {
    let users = this.authHttp.get(this.usersUrl)
      .map(response => response.json().content as User[])
      .catch(handleError)
      .toPromise()
    return users;
  }

  getUser(id: number): Promise<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.authHttp.get(url)
      .map(response => response.json().content as User)
      .catch(handleError)
      .toPromise()
  }
}
