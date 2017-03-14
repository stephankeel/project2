import { Component, OnInit } from '@angular/core';
import {UsersService} from "../service/user.service";
import {Router, ActivatedRoute} from "@angular/router";
import {IUser} from "../../../../../server/entities/user.interface";
import {Subscription} from "rxjs";
import {UserType, userTypeAsString} from "../../../../../server/entities/user-type";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  private sub: Subscription;
  private user: IUser = {};

  constructor(private userService: UsersService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.userService.getDataService().subscribe(dataService => {
          this.user = dataService.getCache(params['id']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  back() {
    this.router.navigate(['../../users'], {relativeTo: this.route});
  }

  userTypeAsString(type: UserType) : string{
    return userTypeAsString(type);
  }
}
