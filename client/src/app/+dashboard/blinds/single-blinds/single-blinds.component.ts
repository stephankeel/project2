import {ActivatedRoute, Params, Router} from "@angular/router";
import {Component} from "@angular/core";
import {Subscription} from "rxjs";
import {BlindsDevice} from "../../../misc/device-pool";
import {IBlindsData} from "../../../../../../server/entities/data.interface";
import {NotificationService} from "../../../notification/notification.service";
import {BlindsDeviceCacheService} from "../../../cache/service/blinds-device.cache.service";
import {BlindDataCacheService} from "../../../cache/service/blinds-data.cache.service";

@Component({
  selector: 'app-single-blinds',
  templateUrl: './single-blinds.component.html',
  styleUrls: ['./single-blinds.component.scss']
})
export class SingleBlindsComponent {

  selectedDeviceId: BlindsDevice;

  constructor(private route: ActivatedRoute, private router: Router,
              public blindsDeviceCacheService: BlindsDeviceCacheService,
              public blindDataCacheService: BlindDataCacheService,
              private notificationService: NotificationService) {

    this.route.params.subscribe((params: Params) => {
      this.selectedDeviceId = params['id'];
    });

    this.redirectIfCurrentSelectionIsDeleted();
  }

  private redirectIfCurrentSelectionIsDeleted() {
    this.blindsDeviceCacheService.getAll().subscribe(devices => {
      let currentSelectedDevice = devices.find(device => device.id === this.selectedDeviceId);
      if (currentSelectedDevice === undefined) {
        this.router.navigate(['..'], {relativeTo: this.route});
      }
    });
  }

  private selectDevice(deviceId: string) {
    this.selectedDeviceId = deviceId;
    this.clearMessage();
    this.router.navigate(['../', deviceId], {relativeTo: this.route});
  }

  private clearMessage(): void {
    this.notificationService.clear();
  }

}
