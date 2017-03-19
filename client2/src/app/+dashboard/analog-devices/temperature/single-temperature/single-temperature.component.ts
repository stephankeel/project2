import {ActivatedRoute, Router, Params} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {TemperatureDevice} from '../../../../misc/device-pool';
import {ITemperatureData} from '../../../../../../../server/entities/data.interface';
import {AuthHttp} from 'angular2-jwt';
import {GenericService} from '../../../../remote/generic.service';
import {ClientSocketService} from '../../../../remote/client-socket.service';
import {GenericDataService} from '../../../../remote/generic-data.service';
import {NotificationService} from '../../../../notification/notification.service';

@Component({
  selector: 'app-single-temperature',
  templateUrl: './single-temperature.component.html',
  styleUrls: ['./single-temperature.component.scss']
})
export class SingleTemperatureComponent implements OnInit {

  static readonly TODAY: number = (new Date()).setHours(0, 0, 0); // midnight

  private genericService: GenericService<TemperatureDevice>;
  private dataService: GenericDataService<ITemperatureData>;
  id: any;
  selectedDevice: TemperatureDevice;
  allDevices: TemperatureDevice[] = [];
  deviceData: Observable<ITemperatureData>;
  dataSubscription: Subscription;
  deviceDataHistory: Subject<ITemperatureData[]> = new Subject();

  constructor(private route: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<TemperatureDevice>(this.authHttp, this.socketService, this.notificationService, "/api/devices/temperature", "/temperature");
    this.genericService.items.subscribe(devices => {
      this.allDevices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
      this.resubscribe();
    }, error => this.notificationService.error(error.toString()));
    this.genericService.getAll();

    // listen for route id changes
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.resubscribe();
    });
  }

  ngOnDestroy() {
    this.releaseDevice();
    this.genericService.disconnect();
  }

  resubscribe() {
    this.releaseDevice();
    if (this.allDevices.length > 0 && this.id) {
      let matchingDevices: TemperatureDevice[] = this.allDevices.filter(device => device.id == this.id);
      if (matchingDevices.length > 0) {
        this.selectedDevice = matchingDevices[0];
        this.subscribeDevice();
      }
    }
  }

  subscribeDevice(): void {
    if (this.selectedDevice) {
      let dataService: GenericDataService<ITemperatureData> = new GenericDataService<ITemperatureData>(this.authHttp, this.socketService, '/api/data/temperature', '/temperature', this.selectedDevice.id);
      this.dataService = dataService;
      this.deviceData = dataService.lastItem;
      dataService.getAll();
      this.dataSubscription = dataService.items.subscribe((items: ITemperatureData[]) => {
        let filteredItems: ITemperatureData[] = items.filter(ad => ad.timestamp > SingleTemperatureComponent.TODAY);
        this.deviceDataHistory.next(filteredItems);
      });
    }
  }

  releaseDevice(): void {
    if (this.selectedDevice) {
      let dataService: GenericDataService<ITemperatureData> = this.dataService;
      if (dataService) {
        dataService.disconnect();
        this.dataService = null;
        this.deviceData = null;
        this.dataSubscription.unsubscribe();
      }
    }
  }

  selectDevice(device: TemperatureDevice) {
    this.selectedDevice = device;
    this.clearMessage();
    this.router.navigate(['../', device.id], {relativeTo: this.route});
  }

  clearMessage(): void {
    this.notificationService.clear();
  }

}
