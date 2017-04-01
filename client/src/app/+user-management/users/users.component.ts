import {Component} from '@angular/core';
import {IUser} from '../../../../../server/entities/user.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../remote/authentication.service';
import {UserCacheService} from '../../cache/service/user.cache.service';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.scss']
})
export class UsersComponent  {
  constructor(public userCacheService: UserCacheService,
              private router: Router,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
  }

  isLoggedInUser(user: IUser) {
    return user.username === this.authenticationService.getLoggedInUsername();
  }
}
