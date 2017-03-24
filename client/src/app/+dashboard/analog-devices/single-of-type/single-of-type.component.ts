import {ActivatedRoute, Params, Router} from "@angular/router";
import {Component, Input, OnInit} from "@angular/core";
import {IDevice} from "../../../../../../server/entities/device.interface";
import {DeviceType} from "../../../misc/device-pool";
import {IData} from "../../../../../../server/entities/data.interface";
import {TemperatureDeviceCacheService} from "../../../cache/service/temperature-device.cache.service";
import {HumidityDeviceCacheService} from "../../../cache/service/humidity-device.cache.service";
import {GenericeCacheService} from "../../../cache/service/generic.cache.service";
import {TemperatureDataCacheService} from "../../../cache/service/temperature-data.cache.service";
import {HumidityDataCacheService} from "../../../cache/service/humidity-data.cache.service";
import {GenericDataCacheService} from "../../../cache/service/generic-data-cache.service";
import {NotificationService} from "../../../notification/notification.service";

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

  private deviceCacheService: GenericeCacheService<IDevice>;
  private dataCacheService: GenericDataCacheService<IData, IDevice>;
  private selectedDeviceId: IDevice;

  constructor(private route: ActivatedRoute, private router: Router,
              private notificationService: NotificationService,
              private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private temperatureDataCacheService: TemperatureDataCacheService,
              private humidityDeviceCacheService: HumidityDeviceCacheService,
              private humidityDataCacheService: HumidityDataCacheService) {
  }

  ngOnInit() {
    if (this.deviceType === DeviceType.HUMIDITY) {
      this.title = 'Feuchtigkeit (einzeln)';
      this.label = 'Feuchtigkeit';
      this.units = '%rel';
      this.deviceCacheService = this.humidityDeviceCacheService;
      this.dataCacheService = this.humidityDataCacheService;
    } else {
      this.title = 'Temperatur (einzeln)';
      this.label = 'Temperatur';
      this.units = '°C';
      this.deviceCacheService = this.temperatureDeviceCacheService;
      this.dataCacheService = this.temperatureDataCacheService;
    }

    this.route.params.subscribe((params: Params) => {
      this.selectedDeviceId = params['id'];
    });

    this.redirectIfCurrentSelectionIsDeleted();
  }

  private redirectIfCurrentSelectionIsDeleted() {
    this.deviceCacheService.getAll().subscribe(devices => {
      let currentSelectedDevice = devices.find(device => device.id === this.selectedDeviceId);
      if (currentSelectedDevice === undefined) {
        this.router.navigate(['..'], {relativeTo: this.route});
      }
    });
  }

  private selectDevice(deviceId: string) {
    this.selectedDeviceId = deviceId;
    this.clearMessage();
    this.router.navigate(['../', deviceId], {relativeTo: this.route});
  }

  private clearMessage(): void {
    this.notificationService.clear();
  }

}
