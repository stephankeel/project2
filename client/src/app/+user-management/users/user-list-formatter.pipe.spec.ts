import {UserListFormatterPipe} from './user-list-formatter.pipe';
import {IUser} from '../../../../../server/entities/user.interface';

describe('UserListFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new UserListFormatterPipe();
    expect(pipe).toBeTruthy();
  });
  it('test username, firstname and lastname attributes of IUser', () => {
    const pipe = new UserListFormatterPipe();
    const user: IUser = {username: 'username1', firstname: 'firstname1', lastname: 'lastname1'};
    expect(pipe.transform(user)).toEqual('firstname1 lastname1 (username1)');
  });
  it('test empty IUser', () => {
    const pipe = new UserListFormatterPipe();
    const user: IUser = {};
    expect(pipe.transform(user)).toEqual('undefined undefined (undefined)');
  });
  it('test null', () => {
    const pipe = new UserListFormatterPipe();
    expect(pipe.transform(null)).toBeNull();
  });
});
