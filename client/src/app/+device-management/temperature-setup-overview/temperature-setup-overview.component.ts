import {Component} from '@angular/core';
import {TemperatureDeviceCacheService} from '../../cache/service/temperature-device.cache.service';
import {AnalogPortService} from '../service/analog-port.service';

@Component({
  selector: 'app-temperature-setup-overview',
  templateUrl: './temperature-setup-overview.component.html',
  styleUrls: ['./temperature-setup-overview.component.scss']
})
export class TemperatureSetupOverviewComponent {

  constructor(public temperatureDeviceCacheService: TemperatureDeviceCacheService,
              public analogPortService: AnalogPortService) {
  }
}
