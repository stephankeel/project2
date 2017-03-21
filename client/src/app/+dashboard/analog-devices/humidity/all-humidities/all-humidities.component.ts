import {Component} from '@angular/core';
import {DeviceType} from '../../../../misc/device-pool';

@Component({
  selector: 'app-all-humidities',
  templateUrl: 'all-humidities.component.html',
  styleUrls: ['all-humidities.component.scss']
})
export class AllHumiditiesComponent{

  private deviceType: DeviceType = DeviceType.HUMIDITY;

  constructor() {
  }

}
