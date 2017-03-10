import {Component, OnInit} from '@angular/core';
import {DeviceType, DevicesInfo, devicePool} from '../../misc/device-pool';
import {Router} from "@angular/router";

@Component({
  selector: 'app-device-overview',
  templateUrl: './device-overview.component.html',
  styleUrls: ['./device-overview.component.scss']
})
export class DeviceOverviewComponent implements OnInit {
  devices: DevicesInfo[] = devicePool;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  clickAction(device: DevicesInfo): void {
    switch (device.type) {
      case DeviceType.BLINDS:
        this.router.navigate(['/dashboard/blinds-overview']);
        break;
      case DeviceType.HUMIDITY:
        this.router.navigate(['/dashboard/humidity-overview']);
        break;
      case DeviceType.TEMPERATURE:
        this.router.navigate(['/dashboard/temperature-overview']);
        break;
    }
  }
}
