import {ActivatedRoute, Router, Params} from '@angular/router';
import {Component, OnInit, Input} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {IDevice} from '../../../../../../server/entities/device.interface';
import {DeviceType} from '../../../misc/device-pool';
import {IAnalogData} from '../../../../../../server/entities/data.interface';
import {AuthHttp} from 'angular2-jwt';
import {GenericService} from '../../../remote/generic.service';
import {ClientSocketService} from '../../../remote/client-socket.service';
import {GenericDataService} from '../../../remote/generic-data.service';
import {NotificationService} from '../../../notification/notification.service';

@Component({
  selector: 'app-single-of-type',
  templateUrl: './single-of-type.component.html',
  styleUrls: ['./single-of-type.component.scss']
})
export class SingleOfTypeComponent implements OnInit {

  static readonly TODAY: number = (new Date()).setHours(0, 0, 0); // midnight

  @Input() deviceType: DeviceType;

  private title: string;
  private units: string;
  private label: string;

  private genericService: GenericService<IDevice>;
  private dataService: GenericDataService<IAnalogData>;
  id: any;
  selectedDevice: IDevice;
  allDevices: IAnalogData[] = [];
  deviceData: IAnalogData;
  dataSubscription: Subscription;
  deviceDataHistory: Subject<IAnalogData[]> = new Subject();

  constructor(private route: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {

    // TODO: This is a dirty hack as deviceType is not set when instantiated by a route
    if (!this.deviceType) {
      let compStr: string = this.route.component.toString();
      let pos: number = compStr.indexOf('SingleHumidityComponent');
      if (pos >= 0) {
        this.deviceType = DeviceType.HUMIDITY;
      } else {
        this.deviceType = DeviceType.TEMPERATURE;
      }
    }

    if (this.deviceType === DeviceType.HUMIDITY) {
      this.title = 'Feuchtigkeit (einzeln)';
      this.label = 'Feuchtigkeit';
      this.units = '%rel';
      this.genericService = new GenericService<IDevice>(this.authHttp, this.socketService, this.notificationService, '/api/devices/humidity', '/humidity');
    } else {
      this.title = 'Temperatur (einzeln)';
      this.label = 'Temperatur';
      this.units = '°C';
      this.genericService = new GenericService<IDevice>(this.authHttp, this.socketService, this.notificationService, '/api/devices/temperature', '/temperature');
    }
  }

  ngOnInit() {
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
      let matchingDevices: IDevice[] = this.allDevices.filter(device => device.id == this.id);
      if (matchingDevices.length > 0) {
        this.selectedDevice = matchingDevices[0];
        this.subscribeDevice();
      }
    }
  }

  subscribeDevice(): void {
    if (this.selectedDevice) {
      if (this.deviceType === DeviceType.HUMIDITY) {
        this.dataService = new GenericDataService<IAnalogData>(this.authHttp, this.socketService, '/api/data/humidity', '/humidity', this.selectedDevice.id);
      } else {
        this.dataService = new GenericDataService<IAnalogData>(this.authHttp, this.socketService, '/api/data/temperature', '/temperature', this.selectedDevice.id);
      }
      this.dataSubscription = this.dataService.items.subscribe((items: IAnalogData[]) => {
        let filteredItems: IAnalogData[] = items.filter(ad => ad.timestamp > SingleOfTypeComponent.TODAY);
        this.deviceDataHistory.next(filteredItems);
        this.deviceData = items[items.length - 1];
      });
      this.dataService.getAll();
    }
  }

  releaseDevice(): void {
    if (this.selectedDevice) {
      if (this.dataService) {
        this.dataService.disconnect();
        this.dataService = null;
        this.deviceData = null;
        this.dataSubscription.unsubscribe();
        this.dataSubscription = null;
      }
    }
  }

  selectDevice(device: IDevice) {
    this.selectedDevice = device;
    this.clearMessage();
    this.router.navigate(['../', device.id], {relativeTo: this.route});
  }

  clearMessage(): void {
    this.notificationService.clear();
  }

}
