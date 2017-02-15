import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";

import {GenericService} from "../remote/generic.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {BlindsDevice, blindsDevicesInfo, Port, portName} from '../device-pool';
import {GenericDataService} from "../remote/generic-data.service";
import {IBlindsDevice} from "../../../../server/entities/device.interface";
import {IBlindsData} from "../../../../server/entities/data.interface";
import {BlindsDataObservablePipe} from './blinds-data-observable.pipe';
import {BlindsDataFormatterPipe} from './blinds-data-formatter.pipe';

@Component({
  selector: 'app-blinds',
  templateUrl: './blinds.component.html',
  styleUrls: ['./blinds.component.scss'],
  providers: [BlindsDataObservablePipe, BlindsDataFormatterPipe]
})
export class BlindsComponent implements OnInit {

  private headerTitle: string = `${blindsDevicesInfo.displayName}-STEUERUNG`;
  private devices: BlindsDevice[] = [];
  private selectedDevice: BlindsDevice;
  private genericService: GenericService<BlindsDevice>;
  private statusText: string = 'stopped';
  private message: string;
  private dataServices: Map<BlindsDevice, GenericDataService<IBlindsData>> = new Map<BlindsDevice, GenericDataService<IBlindsData>>();
  private devicesState: Map<BlindsDevice, Observable<IBlindsData>> = new Map<BlindsDevice, Observable<IBlindsData>>();

  constructor(private router: Router,
              private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.genericService = new GenericService<BlindsDevice>(this.authHttp, this.socketService, "/api/devices/blinds", "/blinds");
    this.genericService.items.subscribe(devices => {
      this.devices = devices.toArray();
      this.selectedDevice = null;
    }, error => this.message = error.toString());
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.genericService.disconnect();
    this.devices.forEach(device => this.releaseDevice(device));
  }

  subscribeDevice(device: BlindsDevice): void {
    let dataService: GenericDataService<IBlindsData> = new GenericDataService<IBlindsData>(this.authHttp, this.socketService, '/api/data/blinds', '/blinds', device.id);
    this.dataServices.set(device, dataService);
    this.devicesState.set(device, dataService.lastItem);
//    dataService.getAll();
    dataService.getLatest();
  }

  releaseDevice(device: BlindsDevice): void {
    let dataService:  GenericDataService<IBlindsData> = this.dataServices.get(device);
    if (dataService) {
      dataService.disconnect();
      this.dataServices.delete(device);
      this.devicesState.delete(device);
    }
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

  selectDevice(device: BlindsDevice) {
    this.clearMessage();
    if (this.selectedDevice) {
      this.releaseDevice(this.selectedDevice);
    }
    this.subscribeDevice(device);
    this.selectedDevice = device;
  }

  clearMessage(): void {
    this.message = null;
  }

  keyUpAction(): void {

  }

  keyDownAction(): void {

  }

  stopAction(): void {

  }

}
