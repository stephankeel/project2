import {Component, OnInit, OnDestroy} from '@angular/core';
import {GenericService} from "../../remote/generic.service";
import {IUser} from "../../../../../server/entities/user.interface";
import {ClientSocketService} from "../../remote/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {UserType, userTypeAsString} from "../../../../../server/entities/user-type";
import {UsersService} from "../service/user.service";
import {ReplaySubject, Observable} from "rxjs";
import {List} from "immutable";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../remote/authentication.service";

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.scss']
})
export class UsersComponent implements OnInit {
  private items: Observable<List<IUser>> = new ReplaySubject<List<IUser>>(1);

  constructor(private userService: UsersService, private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.userService.getDataService().subscribe(userService => {
      this.items = userService.items;
    })
  }

  isLoggedInUser(user: IUser) {
    return user.username === this.authenticationService.getLoggedInUsername();
  }
}
