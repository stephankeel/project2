import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ITemperatureDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {NotificationService} from "../../../notification/notification.service";
import {TemperatureDeviceCacheService} from "../../../cache/temperature-device.cache.service";

@Component({
  selector: 'app-temperaturedevice-delete',
  templateUrl: './temperaturedevice-delete.component.html',
  styleUrls: ['./temperaturedevice-delete.component.scss']
})
export class TemperaturedeviceDeleteComponent implements OnInit {

  private sub: Subscription;
  private temperatureDevice: ITemperatureDevice = {};

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.temperatureDeviceCacheService.getDataService().subscribe(dataService => {
          this.temperatureDevice = dataService.getCache(params['id']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteTemperature() {
    this.temperatureDeviceCacheService.getDataService().subscribe(dataService => {
      if (this.temperatureDevice.id) {
        dataService.getRestService().del(this.temperatureDevice.id).subscribe(temperatureDevice => {
          this.notificationService.info(`Temperatursensor gelöscht.`);
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Temperatursensor konnte nicht gelöscht werden (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
