import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {AuthHttp} from "angular2-jwt";

import {DeviceType, DevicesInfo, devicePool, Port} from '../device-pool';
import {GenericService} from "../remote/generic.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {BlindsDevice, HumidityDevice, TemperatureDevice, AnalogDevicesInfo, blindsDevicesInfo, humidityDevicesInfo, temperatureDevicesInfo} from '../device-pool';
import {NotificationService} from '../notification/notification.service';


@Component({
  selector: 'app-devices',
  templateUrl: 'devices-setup.component.html',
  styleUrls: ['devices-setup.component.scss']
})
export class DevicesSetupComponent implements OnInit {

  devicePool: DevicesInfo[] = devicePool;
  blindsDeviceService: GenericService<BlindsDevice>;
  humidityDeviceService: GenericService<HumidityDevice>;
  temperatureDeviceService: GenericService<TemperatureDevice>;
  message: string;

  constructor(private router: Router, private socketService: ClientSocketService, private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.handleBlindsDevices();
    this.handleHumidityDevices();
    this.handleTemperatureDevices();
  }

  ngOnDestroy() {
    this.blindsDeviceService.disconnect();
    this.humidityDeviceService.disconnect();
    this.temperatureDeviceService.disconnect();
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

  clickAction(device: DevicesInfo): void {
    switch (device.type) {
      case DeviceType.BLINDS:
        this.router.navigate(['blinds-setup']);
        break;
      case DeviceType.HUMIDITY:
        this.router.navigate(['humidity-setup']);
        break;
      case DeviceType.TEMPERATURE:
        this.router.navigate(['temperature-setup']);
        break;
    }
  }

  handleBlindsDevices(): void {
    this.blindsDeviceService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, this.notificationService, "/api/devices/blinds", "/blinds");
    this.blindsDeviceService.items.subscribe(devices => {
      blindsDevicesInfo.count = devices.count();
      blindsDevicesInfo.updatePortsInUse(devices.toArray());
    }, error => this.message = error.toString());
    this.blindsDeviceService.getAll();
  }

  handleHumidityDevices(): void {
    this.humidityDeviceService = new GenericService<HumidityDevice>(this.authHttp, this.socketService, this.notificationService, "/api/devices/humidity", "/humidity");
    this.humidityDeviceService.items.subscribe(devices => {
      humidityDevicesInfo.count = devices.count();
      AnalogDevicesInfo.updateAnalogPortsInUse(humidityDevicesInfo, devices.toArray().map(device => device.port));
    }, error => this.message = error.toString());
    this.humidityDeviceService.getAll();
  }

  handleTemperatureDevices(): void {
    this.temperatureDeviceService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, this.notificationService, "/api/devices/temperature", "/temperature");
    this.temperatureDeviceService.items.subscribe(devices => {
      temperatureDevicesInfo.count = devices.count();
      AnalogDevicesInfo.updateAnalogPortsInUse(temperatureDevicesInfo, devices.toArray().map(device => device.port));
    }, error => this.message = error.toString());
    this.temperatureDeviceService.getAll();
  }

}
