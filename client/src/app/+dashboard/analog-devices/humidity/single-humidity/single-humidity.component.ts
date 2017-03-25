import {Component} from '@angular/core';
import {DeviceType} from '../../../../misc/device-pool';

@Component({
  selector: 'app-single-humidity',
  templateUrl: './single-humidity.component.html',
  styleUrls: ['./single-humidity.component.scss']
})
export class SingleHumidityComponent {

  deviceType: DeviceType = DeviceType.HUMIDITY;

  constructor() {
  }

}
