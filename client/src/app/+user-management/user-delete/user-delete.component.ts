import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {IUser} from '../../../../../server/entities/user.interface';
import {NotificationService} from '../../notification/notification.service';
import {UserCacheService} from '../../cache/service/user.cache.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  user: IUser = {};

  constructor(private userCacheService: UserCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
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


  deleteUser() {
    if (this.user.id) {
      this.userCacheService.delDevice(this.user.id).subscribe(deletedUserId => {
        this.notificationService.info('Benutzer gelöscht.');
        this.router.navigate(['../..'], {relativeTo: this.route});
      }, error => {
        this.notificationService.error(`Benutzer konnte nicht gelöscht werden (${JSON.stringify(error)})`);
      });
    }
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}

