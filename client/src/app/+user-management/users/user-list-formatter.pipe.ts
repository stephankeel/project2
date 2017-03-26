import {Pipe, PipeTransform} from '@angular/core';
import {IUser} from "../../../../../server/entities/user.interface";

@Pipe({
  name: 'userListFormatter'
})
export class UserListFormatterPipe implements PipeTransform {

  transform(user: IUser): string {
    if (user) {
      return `${user.firstname} ${user.lastname} (${user.username})`;
    }
    return null;
  }
}
