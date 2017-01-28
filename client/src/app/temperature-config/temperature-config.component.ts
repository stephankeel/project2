import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {TemperatureDevice, TemperatureDeviceCharacteristics, Port, portName} from '../device-pool';


@Component({
  selector: 'app-temperature-config',
  templateUrl: './temperature-config.component.html',
  styleUrls: ['./temperature-config.component.scss']
})
export class TemperatureConfigComponent implements OnInit {

  devices: TemperatureDevice[] = [];
  device: TemperatureDevice;
  selectedDevice: TemperatureDevice;
  ports: Port[] = TemperatureDeviceCharacteristics.portSet;
  selectedPort: Port;
  message: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.devices.push(new TemperatureDevice('1', 'Temp Küche', Port.AI_1));
    this.devices.push(new TemperatureDevice('2', 'Temp Wohnzimmer', Port.AI_2));
    this.devices.push(new TemperatureDevice('3', 'Temp Bad', Port.AI_3));
  }

  backClicked(): void {
    this.router.navigate(['/devices']);
  }

  addClicked(): void {
    this.device = new TemperatureDevice();
  }

  selectDevice(device: TemperatureDevice) {
    this.selectedDevice = device;
    this.device = new TemperatureDevice(this.selectedDevice.id, this.selectedDevice.name, this.selectedDevice.port);
  }

  getPortName(port: Port): string {
    return portName(port);
  }

  doAddOrUpdate(): void {
    if (this.device) {
      if (this.device.id) {
        //TODO: this.genericService.updateUser(this.device).then(() => {...
      } else {
        // TODO: this.genericService.addUser(this.device).then(device => {...
      }
    }
  }

  doDelete(): void {
    if (this.device && this.device.id) {
      // TODO: this.genericService.deleteDevice(this.device).then(() => {...
    }
  }

  clearMessage(): void {
    this.message = null;
  }

}
