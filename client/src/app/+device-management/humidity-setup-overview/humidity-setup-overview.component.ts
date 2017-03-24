import {Component, OnInit} from "@angular/core";
import {IHumidityDevice} from "../../../../../server/entities/device.interface";
import {HumidityDeviceCacheService} from "../../cache/service/humidity-device.cache.service";
import {ReplaySubject, Observable} from "rxjs";
import {List} from "immutable";

@Component({
  selector: 'app-humidity-setup-overview',
  templateUrl: './humidity-setup-overview.component.html',
  styleUrls: ['./humidity-setup-overview.component.scss']
})
export class HumiditySetupOverviewComponent {

  constructor(private humidityDeviceCacheService: HumidityDeviceCacheService) {
  }
}
