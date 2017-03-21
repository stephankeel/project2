import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {IHumidityDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {Port, portName} from "../../../../../../server/hardware/port-map";
import {HumidityDeviceCacheService} from "../../../cache/service/humidity-device.cache.service";

@Component({
  selector: 'app-humiditydevice-details',
  templateUrl: './humiditydevice-details.component.html',
  styleUrls: ['./humiditydevice-details.component.scss']
})
export class HumiditydeviceDetailsComponent implements OnInit {

  private sub: Subscription;
  private humidityDevice: IHumidityDevice = {};

  constructor(private humidityDeviceCacheService: HumidityDeviceCacheService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.humidityDeviceCacheService.getDataService().subscribe(dataService => {
          this.humidityDevice = dataService.getCache(params['id']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  convert(port: Port): string {
    return portName(port);
  }
}
