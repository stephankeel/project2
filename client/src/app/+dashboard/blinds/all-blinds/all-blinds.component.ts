import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {BlindsDevice, DeviceType} from "../../../misc/device-pool";
import {IBlindsData} from "../../../../../../server/entities/data.interface";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../../../remote/client-socket.service";
import {NotificationService} from "../../../notification/notification.service";
import {BlindsDeviceCacheService} from "../../../cache/service/blinds-device.cache.service";
import {DataCacheService} from "../../../cache/service/data-cache.service";


@Component({
  selector: 'app-all-blinds',
  templateUrl: './all-blinds.component.html',
  styleUrls: ['./all-blinds.component.scss']
})
export class AllBlindsComponent implements OnInit {

  private cacheServiceSubscription: Subscription;
  private deviceServiceSubscription: Subscription;
  private devices: BlindsDevice[] = [];
  private devicesState: Map<BlindsDevice, IBlindsData> = new Map<BlindsDevice, IBlindsData>();
  private dataSubscriptions: Map<BlindsDevice, Subscription> = new Map<BlindsDevice, Subscription>();

  constructor(private route: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private blindsDeviceCacheService: BlindsDeviceCacheService, private dataCacheService: DataCacheService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.cacheServiceSubscription = this.blindsDeviceCacheService.getAll().subscribe(devices => {
      this.unsubscribeAll();
      this.devices = devices.sort((a, b) => a.name.localeCompare(b.name));
      this.subscribeAll();
    }, error => this.notificationService.error(error.toString()));
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.deviceServiceSubscription.unsubscribe();
    this.cacheServiceSubscription.unsubscribe();
  }

  private subscribeAll(): void {
    this.devices.forEach(device => {
      let subscription = this.dataCacheService.getCacheLatest(DeviceType.BLINDS, device).subscribe((data: IBlindsData) => {
        this.devicesState.set(device, data);
      });
      this.dataSubscriptions.set(device, subscription);
    });
  }

  private unsubscribeAll(): void {
    this.devices.forEach(device => {
      this.devicesState.delete(device);
      let subscription: Subscription = this.dataSubscriptions.get(device);
      if (subscription) {
        subscription.unsubscribe();
        this.dataSubscriptions.delete(device);
      }
    });
  }

  private getData(device: BlindsDevice): IBlindsData {
    return this.devicesState.get(device);
  }

  private select(device: BlindsDevice): void {
    this.router.navigate(['../blinds', device.id], {relativeTo: this.route});
  }

}
