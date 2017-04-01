import {Component} from '@angular/core';
import {HumidityDeviceCacheService} from '../../cache/service/humidity-device.cache.service';
import {AnalogPortService} from '../service/analog-port.service';

@Component({
  selector: 'app-humidity-setup-overview',
  templateUrl: './humidity-setup-overview.component.html',
  styleUrls: ['./humidity-setup-overview.component.scss']
})
export class HumiditySetupOverviewComponent {

  constructor(public humidityDeviceCacheService: HumidityDeviceCacheService,
              public analogPortService: AnalogPortService) {
  }
}
