import {Component, OnInit} from "@angular/core";
import {ITemperatureDevice} from "../../../../../server/entities/device.interface";
import {ReplaySubject, Observable} from "rxjs";
import {List} from "immutable";
import {TemperatureDeviceCacheService} from "../../cache/service/temperature-device.cache.service";

@Component({
  selector: 'app-temperature-setup-overview',
  templateUrl: './temperature-setup-overview.component.html',
  styleUrls: ['./temperature-setup-overview.component.scss']
})
export class TemperatureSetupOverviewComponent {

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService) {
  }
}
