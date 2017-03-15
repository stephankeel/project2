import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {AuthHttp} from "angular2-jwt";
import {GenericService} from "../../remote/generic.service";
import {ClientSocketService} from "../../remote/client-socket.service";
import {BlindsDevice, blindsDevicesInfo} from '../../misc/device-pool';
import {BlindsDataObservablePipe} from './pipes/blinds-data-observable.pipe';
import {BlindsDataFormatterPipe} from './pipes/blinds-data-formatter.pipe';
import {NotificationService} from '../../notification/notification.service';

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

  constructor(private router: Router, private r: ActivatedRoute, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<BlindsDevice>(this.authHttp, this.socketService, "/api/devices/blinds", "/blinds");
    this.genericService.items.subscribe(devices => {
      this.devices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
      this.showAll();
    }, error => this.notificationService.error(error.toString()));
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.genericService.disconnect();
    this.devices = [];
  }

  showAll(): void {
    this.selectedDevice = null;
    this.router.navigate(['blinds'], {relativeTo: this.r});
  }

  selectDevice(device: BlindsDevice) {
    this.selectedDevice = device;
    this.clearMessage();
    this.router.navigate(['blinds', device.id], {relativeTo: this.r});
  }

  clearMessage(): void {
    this.notificationService.clear();
  }

}
