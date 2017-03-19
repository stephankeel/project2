import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BlindsDevice} from '../../../misc/device-pool';
import {IBlindsData} from "../../../../../../server/entities/data.interface";
import {AuthHttp} from "angular2-jwt";
import {GenericService} from "../../../remote/generic.service";
import {ClientSocketService} from "../../../remote/client-socket.service";
import {GenericDataService} from "../../../remote/generic-data.service";
import {NotificationService} from '../../../notification/notification.service';
import {BlindsDeviceCacheService} from "../../../cache/blinds-device.cache.service";


@Component({
  selector: 'app-all-blinds',
  templateUrl: './all-blinds.component.html',
  styleUrls: ['./all-blinds.component.scss']
})
export class AllBlindsComponent implements OnInit {

  private chacheServiceSubscription: Subscription;
  private dataServices: Map<BlindsDevice, GenericDataService<IBlindsData>> = new Map<BlindsDevice, GenericDataService<IBlindsData>>();
  devices: BlindsDevice[] = [];
  devicesState: Map<BlindsDevice, Observable<IBlindsData>> = new Map<BlindsDevice, Observable<IBlindsData>>();

  constructor(private r: ActivatedRoute, private router: Router, private socketService: ClientSocketService, private blindsDeviceCacheService: BlindsDeviceCacheService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.chacheServiceSubscription = this.blindsDeviceCacheService.getDataService().subscribe((deviceService: GenericService<BlindsDevice>) => {
      deviceService.items.subscribe(devices => {
        this.unsubscribeAll();
        this.devices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
        this.subscribeAll();
      }, error => this.notificationService.error(error.toString()));
      deviceService.getAll();
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.chacheServiceSubscription.unsubscribe();
  }

  subscribeAll(): void {
    this.devices.forEach(device => this.subscribeDevice(device));
  }

  unsubscribeAll(): void {
    this.devices.forEach(device => this.releaseDevice(device));
  }

  subscribeDevice(device: BlindsDevice): void {
    let dataService: GenericDataService<IBlindsData> = new GenericDataService<IBlindsData>(this.authHttp, this.socketService, '/api/data/blinds', '/blinds', device.id);
    this.dataServices.set(device, dataService);
    this.devicesState.set(device, dataService.lastItem);
    dataService.getLatest();
  }

  releaseDevice(device: BlindsDevice): void {
    let dataService: GenericDataService<IBlindsData> = this.dataServices.get(device);
    if (dataService) {
      dataService.disconnect();
      this.dataServices.delete(device);
      this.devicesState.delete(device);
    }
  }

  select(device: BlindsDevice): void {
    this.router.navigate(['../blinds', device.id], {relativeTo: this.r});
  }
}
