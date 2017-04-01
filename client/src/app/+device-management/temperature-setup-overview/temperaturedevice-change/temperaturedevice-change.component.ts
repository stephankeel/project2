import {Component, OnInit} from '@angular/core';
import {ITemperatureDevice} from '../../../../../../server/entities/device.interface';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../notification/notification.service';
import {Port, portName} from '../../../../../../server/hardware/port-map';
import {PortHandler} from '../../service/port-handler';
import {AnalogPortService} from '../../service/analog-port.service';
import {TemperatureDeviceCacheService} from '../../../cache/service/temperature-device.cache.service';

@Component({
  selector: 'app-temperaturedevice-change',
  templateUrl: './temperaturedevice-change.component.html',
  styleUrls: ['./temperaturedevice-change.component.scss']
})
export class TemperaturedeviceChangeComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  temperatureDevice: ITemperatureDevice = {};
  title: string;
  private backlink = '..';
  unusedPortHandler: PortHandler;

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private analogPortService: AnalogPortService) {
  }

  ngOnInit() {
    this.unusedPortHandler = new PortHandler(() => this.analogPortService.getUnusedInputPorts());
    this.subscriptions.push(this.route.params.subscribe(params => {
      if (params['id']) {
        this.temperatureDeviceCacheService.getDevice(params['id']).subscribe(device => {
          this.temperatureDevice = device;
          this.unusedPortHandler.registerPorts([this.temperatureDevice.port]);
          this.title = 'Temperaturesensor ändern';
          this.backlink = '../..';
        });
      } else {
        this.title = 'Neuer Temperaturesensor anlegen';
      }
    }));
  }

  getPortName(port: Port): string {
    return portName(port);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }

  submit(temperatureDevice: ITemperatureDevice) {
    if (this.temperatureDevice.id) {
      temperatureDevice.id = this.temperatureDevice.id;
      this.temperatureDeviceCacheService.updateDevice(temperatureDevice).subscribe(updatedTemperatureDevice => {
        this.notificationService.info('Temperaturesensor aktualisiert');
        this.router.navigate(['../..'], {relativeTo: this.route});
      }, error => {
        this.notificationService.error(`Aktualisierung vom Temperaturesensor fehlgeschlagen (${JSON.stringify(error)})`);
      });
    } else {
      this.temperatureDeviceCacheService.addDevice(temperatureDevice).subscribe(createdTemperatureDevice => {
        this.notificationService.info('Neuer Temperaturesensor erstellt');
        this.router.navigate(['..'], {relativeTo: this.route});
      }, error => {
        this.notificationService.error(`Erstellung vom Temperaturesensor fehlgeschlagen (${JSON.stringify(error)})`);
      });
    }
  }

  cancel() {
    if (this.temperatureDevice.id) {
      this.router.navigate(['../..'], {relativeTo: this.route});
    } else {
      this.router.navigate(['..'], {relativeTo: this.route});
    }
  }
}
