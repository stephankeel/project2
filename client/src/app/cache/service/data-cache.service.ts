import {Injectable} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {Observable, Subscription, ReplaySubject} from "rxjs";
import {IDevice} from "../../../../../server/entities/device.interface";
import {IId} from "../../../../../server/entities/id.interface";
import {IData} from "../../../../../server/entities/data.interface";
import {ClientSocketService} from "../../remote/client-socket.service";
import {NotificationService} from "../../notification/notification.service";
import {BlindsDeviceCacheService} from './blinds-device.cache.service';
import {HumidityDeviceCacheService} from './humidity-device.cache.service';
import {TemperatureDeviceCacheService} from './temperature-device.cache.service'
import {GenericeCacheService} from './generic.cache.service';
import {GenericDataService} from "../../remote/generic-data.service";
import {DeviceType} from "../../misc/device-pool";
import {IBlindsData, IHumidityData, ITemperatureData} from "../../../../../server/entities/data.interface";


@Injectable()
export class DataCacheService {

  private dataCacheLatest: Map<IId, ReplaySubject<IData>> = new Map<IId, ReplaySubject<IData>>();
  private dataCacheAll: Map<IId, ReplaySubject<Array<IData>>> = new Map<IId, ReplaySubject<Array<IData>>>();
  private deviceSubscriptions: Map<GenericeCacheService<any>, Subscription> = new Map<GenericeCacheService<any>, Subscription>();

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private notificationService: NotificationService,
              private blindsDeviceCacheService: BlindsDeviceCacheService,
              private humidityDeviceCacheService: HumidityDeviceCacheService,
              private temperatureDeviceCacheService: TemperatureDeviceCacheService) {
    console.log("DataCacheService: created");
  }

  /**
   * Returns the observable to listen for the latest data of the provided deviceType and device.
   */
  public getCacheLatest(deviceType: DeviceType, device: IDevice): Observable<IData> {
    let cacheLatestObs: ReplaySubject<IData> = this.dataCacheLatest.get(device.id);
    if (!cacheLatestObs) {
      // subscribe to the data service
      let dataService: GenericDataService<any> = this.getDataService(deviceType, device);
      if (dataService) {
        cacheLatestObs = dataService.lastItem;
        if (cacheLatestObs.isEmpty) {
          dataService.getLatest();
        }
        this.dataCacheLatest.set(device.id, cacheLatestObs);
      }
      this.listenForDeviceDeletion(deviceType);
    }
    return cacheLatestObs;
  }

  /**
   * Returns the observable to listen for all data of the provided deviceType and device.
   */
  public getCacheAll(deviceType: DeviceType, device: IDevice): Observable<IData[]> {
    let cacheAllObs: ReplaySubject<Array<IData>> = this.dataCacheAll.get(device.id);
    if (!cacheAllObs) {
      // subscribe to the data service
      let dataService: GenericDataService<any> = this.getDataService(deviceType, device);
      if (dataService) {
        cacheAllObs = dataService.items;
        if (cacheAllObs.isEmpty) {
          dataService.getAll();
        }
        this.dataCacheAll.set(device.id, cacheAllObs);
      }
      this.listenForDeviceDeletion(deviceType);
    }
    return cacheAllObs;
  }

  /**
   * Listen for device deletion to be able to cleanup the cache if such happens.
   * @param deviceType the type of device to listen for changes
   */
  private listenForDeviceDeletion(deviceType: DeviceType) {
    let deviceService: GenericeCacheService<any> = this.getDeviceService(deviceType);
    let deviceSubscription: Subscription = this.deviceSubscriptions.get(deviceService);
    if (!deviceSubscription) {
      deviceSubscription = deviceService.getDataService().subscribe((deviceService: GenericService<IDevice>) => {
        deviceService.items.subscribe(devices => {
          let deviceSet: Set<any> = new Set<any>(devices);
          // we are just interested in delete devices -> remove data subscription
          let removedIds: IDevice[] = [];
          this.dataCacheAll.forEach((id, val) => {
            if (!deviceSet.has(id)) {
              removedIds.push(id);
            }
          });
          removedIds.forEach((id: IId) => {
            this.dataCacheLatest.delete(id);
            this.dataCacheAll.delete(id);
          });
        }, error => this.notificationService.error(error.toString()));
        deviceService.getAll();
      });
      this.deviceSubscriptions.set(deviceService, deviceSubscription);
    }
  }

  private getDataService(deviceType: DeviceType, device: IDevice): GenericDataService<any> {
    if (deviceType === DeviceType.BLINDS) {
      return new GenericDataService<IBlindsData>(this.http, this.socketService, '/api/data/blinds', '/blinds', device.id);
    } else if (deviceType === DeviceType.HUMIDITY) {
      return new GenericDataService<IHumidityData>(this.http, this.socketService, '/api/data/humidity', '/humidity', device.id);
    } else if (deviceType === DeviceType.TEMPERATURE) {
      return new GenericDataService<ITemperatureData>(this.http, this.socketService, '/api/data/temperature', '/temperature', device.id);
    }
    return null;
  }

  private getDeviceService(deviceType: DeviceType): GenericeCacheService<any> {
    if (deviceType === DeviceType.BLINDS) {
      return this.blindsDeviceCacheService;
    } else if (deviceType === DeviceType.HUMIDITY) {
      return this.humidityDeviceCacheService;
    } else if (deviceType === DeviceType.TEMPERATURE) {
      return this.temperatureDeviceCacheService;
    }
    return null;
  }


}
