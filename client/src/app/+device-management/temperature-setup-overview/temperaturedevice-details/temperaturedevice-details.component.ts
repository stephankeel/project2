import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ITemperatureDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {Port, portName} from "../../../../../../server/hardware/port-map";
import {TemperatureDeviceCacheService} from "../../../cache/service/temperature-device.cache.service";

@Component({
  selector: 'app-temperaturedevice-details',
  templateUrl: './temperaturedevice-details.component.html',
  styleUrls: ['./temperaturedevice-details.component.scss']
})
export class TemperaturedeviceDetailsComponent implements OnInit {

  private sub: Subscription;
  temperatureDevice: ITemperatureDevice = {};

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.temperatureDeviceCacheService.getDevice(params['id']).subscribe(device => {
          this.temperatureDevice = device;
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
