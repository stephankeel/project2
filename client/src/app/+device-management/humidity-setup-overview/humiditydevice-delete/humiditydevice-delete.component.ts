import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IAnalogDevice} from '../../../../../../server/entities/device.interface';
import {Subscription} from 'rxjs/Subscription';
import {NotificationService} from '../../../notification/notification.service';
import {HumidityDeviceCacheService} from '../../../cache/service/humidity-device.cache.service';

@Component({
  selector: 'app-humiditydevice-delete',
  templateUrl: './humiditydevice-delete.component.html',
  styleUrls: ['./humiditydevice-delete.component.scss']
})
export class HumiditydeviceDeleteComponent implements OnInit {

  private sub: Subscription;
  humidityDevice: IAnalogDevice = {};

  constructor(private humidityDeviceCacheService: HumidityDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.humidityDeviceCacheService.getDevice(params['id']).subscribe(device => {
          this.humidityDevice = device;
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteHumidity() {
    if (this.humidityDevice.id) {
      this.humidityDeviceCacheService.delDevice(this.humidityDevice.id).subscribe(deleteHumidityDeviceId => {
        this.notificationService.info(`Feuchtigkeitssensor gelöscht.`);
        this.router.navigate(['../..'], {relativeTo: this.route});
      }, error => {
        this.notificationService.error(`Feuchtigkeitssensor konnte nicht gelöscht werden (${JSON.stringify(error)})`);
      });
    }
  }

  cancel() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
