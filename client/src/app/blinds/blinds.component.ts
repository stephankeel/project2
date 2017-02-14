import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthHttp} from "angular2-jwt";

import {GenericService} from "../remote/generic.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {BlindsDevice, blindsDevicesInfo, Port, portName} from '../device-pool';
import {GenericDataService} from "../remote/generic-data.service";

@Component({
  selector: 'app-blinds',
  templateUrl: './blinds.component.html',
  styleUrls: ['./blinds.component.scss']
})
export class BlindsComponent implements OnInit {

  headerTitle: string = `${blindsDevicesInfo.displayName}-STEUERUNG`;
  devices: BlindsDevice[] = [];
  selectedDevice: BlindsDevice;
  genericService: GenericService<BlindsDevice>;
  statusText: string = 'stopped';
  message: string;

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
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

  selectDevice(device: BlindsDevice) {
    this.clearMessage();
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
