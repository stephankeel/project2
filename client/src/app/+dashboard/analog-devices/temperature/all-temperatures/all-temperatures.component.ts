import {Component} from '@angular/core';
import {DeviceType} from '../../../../misc/device-pool';

@Component({
  selector: 'app-all-temperatures',
  templateUrl: 'all-temperatures.component.html',
  styleUrls: ['all-temperatures.component.scss']
})
export class AllTemperaturesComponent {

  deviceType: DeviceType = DeviceType.TEMPERATURE;

  constructor() {
  }

}
