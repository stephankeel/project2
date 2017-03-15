import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BlindsDevice} from '../../../misc/device-pool';
import {IBlindsData} from "../../../../../../server/entities/data.interface";
import {AuthHttp} from "angular2-jwt";
import {GenericService} from "../../../remote/generic.service";
import {ClientSocketService} from "../../../remote/client-socket.service";
import {GenericDataService} from "../../../remote/generic-data.service";
import {NotificationService} from '../../../notification/notification.service';


@Component({
  selector: 'app-all-blinds',
  templateUrl: './all-blinds.component.html',
  styleUrls: ['./all-blinds.component.scss']
})
export class AllBlindsComponent implements OnInit {

  private genericService: GenericService<BlindsDevice>;
  private dataServices: Map<BlindsDevice, GenericDataService<IBlindsData>> = new Map<BlindsDevice, GenericDataService<IBlindsData>>();
  devices: BlindsDevice[] = [];
  devicesState: Map<BlindsDevice, Observable<IBlindsData>> = new Map<BlindsDevice, Observable<IBlindsData>>();

  constructor(private r: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<BlindsDevice>(this.authHttp, this.socketService, "/api/devices/blinds", "/blinds");
    this.genericService.items.subscribe(devices => {
      this.unsubscribeAll();
      this.devices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
      this.subscribeAll();
    }, error => this.notificationService.error(error.toString()));
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.genericService.disconnect();
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
