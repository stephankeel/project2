import {Component, OnInit} from '@angular/core';
import {DeviceType, DevicesInfo, devicePool} from '../../misc/device-pool';

@Component({
  selector: 'app-device-overview',
  templateUrl: './device-overview.component.html',
  styleUrls: ['./device-overview.component.scss']
})
export class DeviceOverviewComponent implements OnInit {
  devices: DevicesInfo[] = devicePool;

  constructor() {
  }

  ngOnInit() {
  }

}
