import {ITemperatureData} from "../../../../server/entities/data.interface";
import {GenericDataService} from "../remote/generic-data.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {Subscription} from "rxjs";

export class TemperatureDataService {
  private temperatureDataService: GenericDataService<ITemperatureData>;
  private allValues: ITemperatureData[] = [];
  private latest: ITemperatureData = {value: 0};
  private itemsSubscription : Subscription;
  private lastItemSubscription: Subscription;

  constructor(private socketService: ClientSocketService, private authHttp: AuthHttp, private temperatureDeviceId: string) {
    this.temperatureDataService = new GenericDataService<ITemperatureData>(this.authHttp, this.socketService,
      '/api/data/temperature', '/temperature', this.temperatureDeviceId);
    this.itemsSubscription = this.temperatureDataService.items.subscribe(temperatureDatas => {
      this.allValues = temperatureDatas.toArray();
    });
    this.temperatureDataService.getAll();
    this.lastItemSubscription = this.temperatureDataService.lastItem.subscribe(temperatureData => {
      this.latest = temperatureData;
    });
    this.temperatureDataService.getLatest();
  }

  onDestroy() {
    this.itemsSubscription.unsubscribe();
    this.lastItemSubscription.unsubscribe();
  }
}
