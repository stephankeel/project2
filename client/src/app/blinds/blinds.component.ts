import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";

import {GenericService} from "../remote/generic.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {BlindsDevice, blindsDevicesInfo, Port, portName} from '../device-pool';
import {GenericDataService} from "../remote/generic-data.service";
import {BlindsCommandService} from '../remote/blinds-command.service';
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
  private selectedDevicePercentageDown: number = 33;
  private genericService: GenericService<BlindsDevice>;
  private message: string;
  private dataServices: Map<BlindsDevice, GenericDataService<IBlindsData>> = new Map<BlindsDevice, GenericDataService<IBlindsData>>();
  private devicesState: Map<BlindsDevice, Observable<IBlindsData>> = new Map<BlindsDevice, Observable<IBlindsData>>();

  constructor(private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private commandService: BlindsCommandService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<BlindsDevice>(this.authHttp, this.socketService, "/api/devices/blinds", "/blinds");
    this.genericService.items.subscribe(devices => {
      this.devices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
      this.showAll();
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

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

  showAllClicked(): void {
    this.showAll();
  }

  showAll(): void {
    if (this.selectedDevice) {
      this.releaseDevice(this.selectedDevice);
    }
    this.selectedDevice = null;
    this.devices.forEach(device => this.subscribeDevice(device));
  }

  selectDevice(device: BlindsDevice) {
    this.clearMessage();
    if (this.selectedDevice) {
      this.releaseDevice(this.selectedDevice);
    } else {
      this.devices.forEach(device => this.releaseDevice(device));
    }
    this.subscribeDevice(device);
    this.selectedDevice = device;
    this.devicesState.get(device).subscribe((data: IBlindsData) => {
      this.selectedDevicePercentageDown = data.percentageDown
    });
  }

  setMessage(str: string) {
    this.message = str;
  }

  clearMessage(): void {
    this.message = null;
  }

}
