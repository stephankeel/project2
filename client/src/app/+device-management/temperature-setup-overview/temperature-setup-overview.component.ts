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
export class TemperatureSetupOverviewComponent implements OnInit {

  private items: Observable<List<ITemperatureDevice>> = new ReplaySubject<List<ITemperatureDevice>>(1);

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService) {
  }

  ngOnInit() {
    this.temperatureDeviceCacheService.getDataService().subscribe(temperatureService => {
      this.items = temperatureService.items;
    })
  }
}
