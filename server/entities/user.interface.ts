import {UserType} from './user-type';

export interface IUser {
  id?: any;
  firstname?: string;
  lastname?: string;
  type?: UserType;
  username?: string;
  password?: string;
}
;
