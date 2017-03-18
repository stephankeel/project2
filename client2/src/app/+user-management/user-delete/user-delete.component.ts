import {Component, OnInit, OnDestroy} from '@angular/core';
import {UsersService} from "../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {IUser} from "../../../../../server/entities/user.interface";
import {NotificationService} from "../../notification/notification.service";

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  private user: IUser = {};

  constructor(private userService: UsersService, private route: ActivatedRoute, private router: Router, private notificationService: NotificationService) {
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


  deleteUser() {
    this.userService.getDataService().subscribe(dataService => {
      if (this.user.id) {
        dataService.getRestService().del(this.user.id).subscribe(user => {
          this.notificationService.info(`Benutzer gelöscht.`);
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Benutzer konnte nicht gelöscht werden (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}

