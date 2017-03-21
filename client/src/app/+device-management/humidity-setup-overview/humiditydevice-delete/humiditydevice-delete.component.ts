import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {IHumidityDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {NotificationService} from "../../../notification/notification.service";
import {HumidityDeviceCacheService} from "../../../cache/humidity-device.cache.service";

@Component({
  selector: 'app-humiditydevice-delete',
  templateUrl: './humiditydevice-delete.component.html',
  styleUrls: ['./humiditydevice-delete.component.scss']
})
export class HumiditydeviceDeleteComponent implements OnInit {

  private sub: Subscription;
  private humidityDevice: IHumidityDevice = {};

  constructor(private humidityDeviceCacheService: HumidityDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.humidityDeviceCacheService.getDataService().subscribe(dataService => {
          this.humidityDevice = dataService.getCache(params['id']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteHumidity() {
    this.humidityDeviceCacheService.getDataService().subscribe(dataService => {
      if (this.humidityDevice.id) {
        dataService.getRestService().del(this.humidityDevice.id).subscribe(humidityDevice => {
          this.notificationService.info(`Feuchtigkeitssensor gelöscht.`);
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Feuchtigkeitssensor konnte nicht gelöscht werden (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
