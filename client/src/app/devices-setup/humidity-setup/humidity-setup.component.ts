import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GenericService} from "../../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../../remote/client-socket.service";

import {HumidityDevice, HumidityDeviceCharacteristics, Port, portName} from '../../device-pool';


@Component({
  selector: 'app-humidity-config',
  templateUrl: 'humidity-setup.component.html',
  styleUrls: ['humidity-setup.component.scss']
})
export class HumiditySetupComponent implements OnInit {
  headerTitle: string = 'FEUCHTIGKEIT-SETUP';
  devices: HumidityDevice[] = [];
  device: HumidityDevice;
  selectedDevice: HumidityDevice;
  ports: Port[] = HumidityDeviceCharacteristics.portSet;
  private genericService: GenericService<HumidityDevice>;
  message: string;

  constructor(private router: Router,
              private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.genericService = new GenericService<HumidityDevice>(this.authHttp,
      this.socketService, "/api/devices/humidity", "/humidity");
    this.genericService.items.subscribe(devices => {
        this.devices = devices.toArray();
        this.device = null;
        this.selectedDevice = null;
      }, error => this.message = error.toString());
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.genericService.disconnect();
  }

  backClicked(): void {
    this.router.navigate(['/devices']);
  }

  addClicked(): void {
    this.device = new HumidityDevice();
  }

  selectDevice(device: HumidityDevice) {
    this.clearMessage();
    this.selectedDevice = device;
    this.device = new HumidityDevice(this.selectedDevice.id, this.selectedDevice.name, this.selectedDevice.port);
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
    this.message = null;
  }

}
