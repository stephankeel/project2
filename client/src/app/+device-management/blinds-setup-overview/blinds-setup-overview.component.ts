import {Component} from '@angular/core';
import {BlindsDeviceCacheService} from '../../cache/service/blinds-device.cache.service';
import {DigitalPortService} from '../service/digital-port.service';

@Component({
  selector: 'app-blinds-setup-overview',
  templateUrl: './blinds-setup-overview.component.html',
  styleUrls: ['./blinds-setup-overview.component.scss']
})
export class BlindsSetupOverviewComponent {

  constructor(public blindsDeviceCacheService: BlindsDeviceCacheService,
              public digitalPortService: DigitalPortService) {
  }
}
