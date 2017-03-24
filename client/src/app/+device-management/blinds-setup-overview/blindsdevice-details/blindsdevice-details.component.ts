import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BlindsDeviceCacheService} from "../../../cache/service/blinds-device.cache.service";
import {IBlindsDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {Port, portName} from "../../../../../../server/hardware/port-map";

@Component({
  selector: 'app-blindsdevice-details',
  templateUrl: './blindsdevice-details.component.html',
  styleUrls: ['./blindsdevice-details.component.scss']
})
export class BlindsdeviceDetailsComponent implements OnInit {
  private sub: Subscription;
  private blind: IBlindsDevice = {};

  constructor(private blindsCacheService: BlindsDeviceCacheService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.blindsCacheService.getDevice(params['id']).subscribe(device => {
          this.blind = device;
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
