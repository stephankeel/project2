import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {TemperatureDevice} from '../../../misc/device-pool';
import {ITemperatureData} from "../../../../../../server/entities/data.interface";
import {AuthHttp} from "angular2-jwt";
import {GenericService} from "../../../remote/generic.service";
import {ClientSocketService} from "../../../remote/client-socket.service";
import {GenericDataService} from "../../../remote/generic-data.service";
import {NotificationService} from '../../../notification/notification.service';


@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  private genericService: GenericService<TemperatureDevice>;
  private dataServices: Map<TemperatureDevice, GenericDataService<ITemperatureData>> = new Map<TemperatureDevice, GenericDataService<ITemperatureData>>();
  devices: TemperatureDevice[] = [];
  devicesState: Map<TemperatureDevice, Observable<ITemperatureData>> = new Map<TemperatureDevice, Observable<ITemperatureData>>();

  constructor(private r: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, this.notificationService, "/api/devices/temperature", "/temperature");
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

  subscribeDevice(device: TemperatureDevice): void {
    let dataService: GenericDataService<ITemperatureData> = new GenericDataService<ITemperatureData>(this.authHttp, this.socketService, '/api/data/temperature', '/temperature', device.id);
    this.dataServices.set(device, dataService);
    this.devicesState.set(device, dataService.lastItem);
    dataService.getLatest();
  }

  releaseDevice(device: TemperatureDevice): void {
    let dataService: GenericDataService<ITemperatureData> = this.dataServices.get(device);
    if (dataService) {
      dataService.disconnect();
      this.dataServices.delete(device);
      this.devicesState.delete(device);
    }
  }

  select(device: TemperatureDevice): void {
    this.router.navigate(['../temperature', device.id], {relativeTo: this.r});
  }

}
