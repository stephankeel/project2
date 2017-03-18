import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {BlindsDeviceCacheService} from "../../../cache/blinds-device.cache.service";
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
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.blindsCacheService.getDataService().subscribe(dataService => {
          this.blind = dataService.getCache(params['id']);
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
