import {Injectable} from "@angular/core";
import {ReplaySubject, Observable, Subscription} from "rxjs";
import {List} from "immutable";
import {ITemperatureDevice} from "../../../../../server/entities/device.interface";
import {Port, analogInputs} from "../../../../../server/hardware/port-map";
import {TemperatureDeviceCacheService} from "../../cache/service/temperature-device.cache.service";
import {HumidityDeviceCacheService} from "../../cache/service/humidity-device.cache.service";

@Injectable()
export class AnalogPortService {

  private temperatureLoaded: boolean;
  private humidityLoaded: boolean;
  private unusedInputPorts: ReplaySubject<Port[]> = new ReplaySubject<Port[]>(1);
  private itemsTemperatureSub: Subscription;
  private itemsHumiditySub: Subscription;
  private lastTemperatureItems: List<ITemperatureDevice> = List<ITemperatureDevice>();
  private lastHumidityItems: List<ITemperatureDevice> = List<ITemperatureDevice>();

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService, private humidityDeviceCacheService: HumidityDeviceCacheService) {
    this.computeUnusedInputPorts();
    this.init();
  }

  public getUnusedInputPorts(): Observable<Port[]> {
    return this.unusedInputPorts;
  }

  private init() {
    this.temperatureDeviceCacheService.getDataService().subscribe(temperatureService => {
      this.itemsTemperatureSub = temperatureService.items.subscribe(itemList => {
        this.lastTemperatureItems = itemList;
        this.temperatureLoaded = true;
        this.computeUnusedInputPorts();
      });
    });
    this.humidityDeviceCacheService.getDataService().subscribe(humidityService => {
      this.itemsHumiditySub = humidityService.items.subscribe(itemList => {
        this.lastHumidityItems = itemList;
        this.humidityLoaded = true;
        this.computeUnusedInputPorts();
      });
    });
  }

  private computeUnusedInputPorts(){
    return this.computeUnusedPorts(analogInputs);
  }

  private computeUnusedPorts(availablePorts: Port[]) {
    let unusedPorts: Set<Port> = new Set<Port>(availablePorts);
    this.lastTemperatureItems.forEach(item => {
      unusedPorts.delete(item.port);
    });
    this.lastHumidityItems.forEach(item => {
      unusedPorts.delete(item.port);
    });
    this.unusedInputPorts.next(Array.from(unusedPorts));
  }

  private destroy() {
    this.unusedInputPorts.complete();
    if (this.temperatureLoaded && this.itemsHumiditySub) {
      this.itemsHumiditySub.unsubscribe();
    }
    if (this.humidityLoaded && this.itemsTemperatureSub) {
      this.itemsTemperatureSub.unsubscribe();
    }
  }
}
