import {ActivatedRoute, Router} from "@angular/router";
import {Component, Input, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {IDevice} from "../../../../../../server/entities/device.interface";
import {DeviceType} from "../../../misc/device-pool";
import {IAnalogData} from "../../../../../../server/entities/data.interface";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../../../remote/client-socket.service";
import {GenericDataService} from "../../../remote/generic-data.service";
import {NotificationService} from "../../../notification/notification.service";
import {TemperatureDeviceCacheService} from "../../../cache/service/temperature-device.cache.service";
import {HumidityDeviceCacheService} from "../../../cache/service/humidity-device.cache.service";
import {GenericeCacheService} from "../../../cache/service/generic.cache.service";

@Component({
  selector: 'app-all-of-type',
  templateUrl: './all-of-type.component.html',
  styleUrls: ['./all-of-type.component.scss']
})
export class AllOfTypeComponent implements OnInit {

  @Input() deviceType: DeviceType;

  private title: string;
  private devices: IDevice[] = [];
  private units: string;

  private genericCacheService: GenericeCacheService<any>;
  private dataServices: Map<IDevice, GenericDataService<IAnalogData>> = new Map<IDevice, GenericDataService<IAnalogData>>();
  devicesData: Map<IDevice, IAnalogData> = new Map<IDevice, IAnalogData>();
  dataSubscriptions: Map<IDevice, Subscription> = new Map<IDevice, Subscription>();

  constructor(private route: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService,
              private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private humidityDeviceCacheService: HumidityDeviceCacheService) {
  }

  ngOnInit() {
    if (this.deviceType === DeviceType.HUMIDITY) {
      this.title = 'Feuchtigkeit-Übersicht';
      this.units = '%rel';
      this.genericCacheService = this.humidityDeviceCacheService;
    } else {
      this.title = 'Temperatur-Übersicht';
      this.units = '°C';
      this.genericCacheService = this.temperatureDeviceCacheService;
    }
    this.configureItemSubscription();
  }

  private configureItemSubscription() {
    this.genericCacheService.getAll().subscribe(devices => {
      this.unsubscribeAll();
      this.devices = devices.sort((a, b) => a.name.localeCompare(b.name));
      this.subscribeAll();
    }, error => this.notificationService.error(error.toString()));
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.genericCacheService.disconnect();
  }

  private subscribeAll(): void {
    this.devices.forEach(device => this.subscribeDevice(device));
  }

  private unsubscribeAll(): void {
    this.devices.forEach(device => this.releaseDevice(device));
  }

  private subscribeDevice(device: IDevice): void {
    let dataService: GenericDataService<IAnalogData>;
    if (this.deviceType === DeviceType.HUMIDITY) {
      dataService = new GenericDataService<IAnalogData>(this.authHttp, this.socketService, '/api/data/humidity', '/humidity', device.id);
    } else {
      dataService = new GenericDataService<IAnalogData>(this.authHttp, this.socketService, '/api/data/temperature', '/temperature', device.id);
    }
    this.dataServices.set(device, dataService);
    let subscription = dataService.lastItem.subscribe((data: IAnalogData) => this.devicesData.set(device, data));
    this.dataSubscriptions.set(device, subscription);
    dataService.getLatest();
  }

  private releaseDevice(device: IDevice): void {
    let dataService: GenericDataService<IAnalogData> = this.dataServices.get(device);
    if (dataService) {
      dataService.disconnect();
      this.dataServices.delete(device);
      this.devicesData.delete(device);
      this.dataSubscriptions.get(device).unsubscribe();
      this.dataSubscriptions.delete(device);
    }
  }

  select(device: IDevice): void {
    let path: string = this.deviceType === DeviceType.HUMIDITY ? '../humidity' : '../temperature';
    this.router.navigate([path, device.id], {relativeTo: this.route});
  }

  getData(device: IDevice): IAnalogData {
    return this.devicesData.get(device);
  }

}
