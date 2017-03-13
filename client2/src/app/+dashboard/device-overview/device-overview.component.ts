import {Component, OnInit} from '@angular/core';
import {DeviceType, DevicesInfo, devicePool} from '../../misc/device-pool';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-device-overview',
  templateUrl: './device-overview.component.html',
  styleUrls: ['./device-overview.component.scss']
})
export class DeviceOverviewComponent implements OnInit {
  devices: DevicesInfo[] = devicePool;

  constructor(private router: Router, private r: ActivatedRoute) {
  }

  ngOnInit() {
  }

  clickAction(device: DevicesInfo): void {
    switch (device.type) {
      case DeviceType.BLINDS:
        this.router.navigate(['../blinds-overview'], {relativeTo: this.r});
        break;
      case DeviceType.HUMIDITY:
        this.router.navigate(['../humidity-overview'], {relativeTo: this.r});
        break;
      case DeviceType.TEMPERATURE:
        this.router.navigate(['../temperature-overview'], {relativeTo: this.r});
        break;
    }
  }
}
