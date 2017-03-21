import {ActivatedRoute, Router, Params} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BlindsDevice, DeviceType} from '../../../misc/device-pool';
import {IBlindsData} from '../../../../../../server/entities/data.interface';
import {AuthHttp} from 'angular2-jwt';
import {GenericService} from '../../../remote/generic.service';
import {ClientSocketService} from '../../../remote/client-socket.service';
import {NotificationService} from '../../../notification/notification.service';
import {BlindsDeviceCacheService} from '../../../cache/service/blinds-device.cache.service';
import {DataCacheService} from '../../../cache/service/data-cache.service';

@Component({
  selector: 'app-single-blinds',
  templateUrl: './single-blinds.component.html',
  styleUrls: ['./single-blinds.component.scss']
})
export class SingleBlindsComponent implements OnInit {

  private cacheServiceSubscription: Subscription;
  private id: any;
  private selectedDevice: BlindsDevice;
  private allDevices: BlindsDevice[] = [];
  private deviceState: IBlindsData;
  private dataSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private blindsDeviceCacheService: BlindsDeviceCacheService, private dataCacheService: DataCacheService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.cacheServiceSubscription = this.blindsDeviceCacheService.getDataService().subscribe((deviceService: GenericService<BlindsDevice>) => {
      deviceService.items.subscribe(devices => {
        this.allDevices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
        this.resubscribe();
      }, error => this.notificationService.error(error.toString()));
      deviceService.getAll();
    });

    // listen for route id changes
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.resubscribe();
    });
  }

  ngOnDestroy() {
    this.releaseDevice();
    this.cacheServiceSubscription.unsubscribe();
  }

  resubscribe() {
    this.releaseDevice();
    if (this.allDevices.length > 0 && this.id) {
      let matchingDevices: BlindsDevice[] = this.allDevices.filter(device => device.id == this.id);
      if (matchingDevices.length > 0) {
        this.selectedDevice = matchingDevices[0];
        this.subscribeDevice();
      }
    }
  }

  subscribeDevice(): void {
    if (this.selectedDevice) {
      this.dataSubscription = this.dataCacheService.getCacheLatest(DeviceType.BLINDS, this.selectedDevice).subscribe((data: IBlindsData) => {
        this.deviceState = data;
      });
    }
  }

  releaseDevice(): void {
    if (this.selectedDevice) {
      this.deviceState = null;
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
        this.dataSubscription = null;
      }
    }
  }

  selectDevice(device: BlindsDevice) {
    this.selectedDevice = device;
    this.clearMessage();
    this.router.navigate(['../', device.id], {relativeTo: this.route});
  }

  clearMessage(): void {
    this.notificationService.clear();
  }

}
