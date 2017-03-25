import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ITemperatureDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {NotificationService} from "../../../notification/notification.service";
import {TemperatureDeviceCacheService} from "../../../cache/service/temperature-device.cache.service";

@Component({
  selector: 'app-temperaturedevice-delete',
  templateUrl: './temperaturedevice-delete.component.html',
  styleUrls: ['./temperaturedevice-delete.component.scss']
})
export class TemperaturedeviceDeleteComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  temperatureDevice: ITemperatureDevice = {};

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.temperatureDeviceCacheService.getDevice(params['id']).subscribe(device => {
          this.temperatureDevice = device;
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteTemperature() {
    if (this.temperatureDevice.id) {
      this.temperatureDeviceCacheService.delDevice(this.temperatureDevice.id).subscribe(temperatureDevice => {
        this.notificationService.info(`Temperatursensor gelöscht.`);
        this.router.navigate(['../..'], {relativeTo: this.route});
      }, error => {
        this.notificationService.error(`Temperatursensor konnte nicht gelöscht werden (${JSON.stringify(error)})`);
      });
    }
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
