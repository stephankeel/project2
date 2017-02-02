import { Component, OnInit } from '@angular/core';
import {Router}    from '@angular/router';
import {DeviceType, DeviceCharacteristics, devicePool} from '../device-pool';

@Component({
  selector: 'app-devices',
  templateUrl: 'devices-setup.component.html',
  styleUrls: ['devices-setup.component.scss']
})
export class DevicesSetupComponent implements OnInit {

  devices: DeviceCharacteristics[] = devicePool;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

  clickAction(device: DeviceCharacteristics): void {
    switch (device.type) {
      case DeviceType.BLINDS:

        // TODO: this.router.navigate(['/blinds-setup']);
        break;
      case DeviceType.HUMIDITY:
        // TODO: this.router.navigate(['/humidity-setup']);
        break;
      case DeviceType.TEMPERATURE:
        this.router.navigate(['config/temperature']);
        break;
    }
  }

}
