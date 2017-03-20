import { Component, OnInit } from '@angular/core';
import {BlindsDeviceCacheService} from "../../../cache/blinds-device.cache.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IBlindsDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {NotificationService} from "../../../notification/notification.service";

@Component({
  selector: 'app-blindsdevice-delete',
  templateUrl: './blindsdevice-delete.component.html',
  styleUrls: ['./blindsdevice-delete.component.scss']
})
export class BlindsdeviceDeleteComponent implements OnInit {

  private sub: Subscription;
  private blind: IBlindsDevice = {};

  constructor(private blindsCacheService: BlindsDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.blindsCacheService.getDataService().subscribe(dataService => {
          this.blind = dataService.getCache(params['id']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteBlind() {
    this.blindsCacheService.getDataService().subscribe(dataService => {
      if (this.blind.id) {
        dataService.getRestService().del(this.blind.id).subscribe(blind => {
          this.notificationService.info(`Rollladen gelöscht.`);
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Rollladen konnte nicht gelöscht werden (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
