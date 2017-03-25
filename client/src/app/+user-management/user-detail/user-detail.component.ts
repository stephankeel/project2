import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {IUser} from "../../../../../server/entities/user.interface";
import {Subscription} from "rxjs";
import {UserType, userTypeAsString} from "../../../../../server/entities/user-type";
import {UserCacheService} from "../../cache/service/user.cache.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  private sub: Subscription;
  user: IUser = {};

  constructor(private userCacheService: UserCacheService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.userCacheService.getDevice(params['id']).subscribe(user => {
          this.user = user;
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  back() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }

  userTypeAsString(type: UserType): string {
    return userTypeAsString(type);
  }
}
