import {Component} from '@angular/core';
import {DeviceType} from '../../../../misc/device-pool';

@Component({
  selector: 'app-single-temperature',
  templateUrl: './single-temperature.component.html',
  styleUrls: ['./single-temperature.component.scss']
})
export class SingleTemperatureComponent {

  private deviceType: DeviceType = DeviceType.TEMPERATURE;

  constructor() {
  }

}
