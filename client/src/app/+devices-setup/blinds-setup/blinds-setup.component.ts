import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthHttp} from "angular2-jwt";

import {GenericService} from "../../remote/generic.service";
import {ClientSocketService} from "../../remote/client-socket.service";
import {BlindsDevice, blindsDevicesInfo, Port, portName} from '../../device-pool';
import {NotificationService} from '../../notification/notification.service';

@Component({
  selector: 'app-blinds-setup',
  templateUrl: 'blinds-setup.component.html',
  styleUrls: ['blinds-setup.component.scss']
})
export class BlindsSetupComponent implements OnInit {
  headerTitle: string = `${blindsDevicesInfo.displayName}-SETUP`;
  devices: BlindsDevice[] = [];
  device: BlindsDevice;
  selectedDevice: BlindsDevice;
  keyPorts: Port[];
  actorPorts: Port[];
  addActionEnabled: boolean = true;
  private genericService: GenericService<BlindsDevice>;
  message: string;

  constructor(private router: Router,
              private socketService: ClientSocketService, private authHttp: AuthHttp, private notificaitonService: NotificationService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<BlindsDevice>(this.authHttp,
      this.socketService, this.notificaitonService, "/api/devices/blinds", "/blinds");
    this.genericService.items.subscribe(devices => {
      this.devices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
      blindsDevicesInfo.updatePortsInUse(devices.toArray());
      this.updatePortSet();
      this.device = null;
      this.selectedDevice = null;
    }, error => this.message = error.toString());
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.genericService.disconnect();
  }

  backClicked(): void {
    this.router.navigate(['/devices-setup']);
  }

  addClicked(): void {
    this.selectedDevice = null;
    this.updatePortSet();
    this.device = new BlindsDevice();
  }

  selectDevice(device: BlindsDevice) {
    this.clearMessage();
    this.updatePortSet(device);
    this.selectedDevice = device;
    this.device = new BlindsDevice(this.selectedDevice.id, this.selectedDevice.name, this.selectedDevice.keyUp, this.selectedDevice.keyDown, this.selectedDevice.actorUp, this.selectedDevice.actorDown, this.selectedDevice.runningSeconds);
  }

  updatePortSet(device?: BlindsDevice): void {
    this.keyPorts = blindsDevicesInfo.inputPortSet.filter(port => !blindsDevicesInfo.inputPortsInUse.has(port) || device && (port === device.keyUp || port === device.keyDown));
    this.actorPorts = blindsDevicesInfo.outputPortSet.filter(port => !blindsDevicesInfo.outputPortsInUse.has(port) ||device && (port === device.actorUp || port === device.actorDown));
    this.addActionEnabled = device ? this.keyPorts.length > 2 && this.actorPorts.length > 2 : this.keyPorts.length > 0 && this.actorPorts.length > 0;
  }

  getPortName(port: Port): string {
    return portName(port);
  }

  doAddOrUpdate(): void {
    if (this.device) {
      if (this.device.id) {
        this.genericService.update(this.device);
      } else {
        this.genericService.create(this.device);
      }
    }
  }

  doDelete(): void {
    if (this.device && this.device.id) {
      this.genericService.del(this.device.id);
    }
  }

  clearMessage(): void {
    this.notificaitonService.clear();
  }

}
