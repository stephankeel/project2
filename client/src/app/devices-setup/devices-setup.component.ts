import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {AuthHttp} from "angular2-jwt";

import {DeviceType, DevicesInfo, devicePool} from '../device-pool';
import {GenericService} from "../remote/generic.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {BlindsDevice, HumidityDevice, TemperatureDevice, BlindsDevicesInfo, HumidityDevicesInfo, TemperatureDevicesInfo, blindsDevicesInfo, humidityDevicesInfo, temperatureDevicesInfo} from '../device-pool';

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

  constructor(private router: Router, private socketService: ClientSocketService, private authHttp: AuthHttp) {
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
        this.router.navigate(['setup/blinds']);
        break;
      case DeviceType.HUMIDITY:
        this.router.navigate(['setup/humidity']);
        break;
      case DeviceType.TEMPERATURE:
        this.router.navigate(['setup/temperature']);
        break;
    }
  }

  handleBlindsDevices(): void {
    this.blindsDeviceService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, "/api/devices/blinds", "/blinds");
    this.blindsDeviceService.items.subscribe(devices => {
      blindsDevicesInfo.count = devices.count();
      BlindsDevicesInfo.inputPortsInUse.clear();
      devices.forEach(device => {
        BlindsDevicesInfo.inputPortsInUse.add(device.keyUp);
        BlindsDevicesInfo.inputPortsInUse.add(device.keyDown);
        BlindsDevicesInfo.outputPortsInUse.add(device.actorUp);
        BlindsDevicesInfo.outputPortsInUse.add(device.actorDown);
      });
    }, error => this.message = error.toString());
    this.blindsDeviceService.getAll();
  }

  handleHumidityDevices(): void {
    this.humidityDeviceService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, "/api/devices/humidity", "/humidity");
    this.humidityDeviceService.items.subscribe(devices => {
      humidityDevicesInfo.count = devices.count();

    }, error => this.message = error.toString());
    this.humidityDeviceService.getAll();
  }

  handleTemperatureDevices(): void {
    this.temperatureDeviceService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, "/api/devices/temperature", "/temperature");
    this.temperatureDeviceService.items.subscribe(devices => {
      temperatureDevicesInfo.count = devices.count();

    }, error => this.message = error.toString());
    this.temperatureDeviceService.getAll();
  }

}
