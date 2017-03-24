import {Component, OnInit} from "@angular/core";
import {IUser} from "../../../../../server/entities/user.interface";
import {ReplaySubject, Observable} from "rxjs";
import {List} from "immutable";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../remote/authentication.service";
import {UserCacheService} from "../../cache/service/user.cache.service";

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.scss']
})
export class UsersComponent  {
  constructor(private userCacheService: UserCacheService, private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) {
  }

  isLoggedInUser(user: IUser) {
    return user.username === this.authenticationService.getLoggedInUsername();
  }
}
