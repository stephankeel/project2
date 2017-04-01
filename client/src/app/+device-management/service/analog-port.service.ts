import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ITemperatureDevice} from '../../../../../server/entities/device.interface';
import {Port} from '../../../../../server/hardware/port-map';
import {TemperatureDeviceCacheService} from '../../cache/service/temperature-device.cache.service';
import {HumidityDeviceCacheService} from '../../cache/service/humidity-device.cache.service';
import {PortsService} from './ports.service';

@Injectable()
export class AnalogPortService {

  private temperatureLoaded: boolean;
  private humidityLoaded: boolean;
  private unusedInputPorts: ReplaySubject<Port[]> = new ReplaySubject<Port[]>(1);
  private lastTemperatureItems: ITemperatureDevice[] = [];
  private lastHumidityItems: ITemperatureDevice[] = [];

  constructor(private temperatureDeviceCacheService: TemperatureDeviceCacheService,
              private humidityDeviceCacheService: HumidityDeviceCacheService,
              private portsService: PortsService) {
    this.computeUnusedInputPorts();
    this.init();
  }

  public getUnusedInputPorts(): Observable<Port[]> {
    return this.unusedInputPorts;
  }

  private init() {
    this.temperatureDeviceCacheService.getAll().subscribe(itemList => {
      this.lastTemperatureItems = itemList;
      this.temperatureLoaded = true;
      this.computeUnusedInputPorts();
    });
    this.humidityDeviceCacheService.getAll().subscribe(itemList => {
      this.lastHumidityItems = itemList;
      this.humidityLoaded = true;
      this.computeUnusedInputPorts();
    });
  }

  private computeUnusedInputPorts() {
    return this.computeUnusedPorts(this.portsService.getAnalogInputs());
  }

  private computeUnusedPorts(availablePorts: Port[]) {
    const unusedPorts: Set<Port> = new Set<Port>(availablePorts);
    this.lastTemperatureItems.forEach(item => {
      unusedPorts.delete(item.port);
    });
    this.lastHumidityItems.forEach(item => {
      unusedPorts.delete(item.port);
    });
    this.unusedInputPorts.next(Array.from(unusedPorts));
  }
}
