import {inject, TestBed} from '@angular/core/testing';

import {AnalogPortService} from './analog-port.service';
import {HumidityDeviceCacheService} from '../../cache/service/humidity-device.cache.service';
import {TemperatureDeviceCacheService} from '../../cache/service/temperature-device.cache.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {PortsService} from './ports.service';
import {Port} from '../../../../../server/hardware/port-map';
import {IHumidityDevice, ITemperatureDevice} from '../../../../../server/entities/device.interface';

let getAllTemperatureDevices: ReplaySubject<ITemperatureDevice[]>;
let getAllHumidityDevices: ReplaySubject<IHumidityDevice[]>;

describe('AnalogPortService', () => {

  beforeEach(() => {
    getAllTemperatureDevices = new ReplaySubject<ITemperatureDevice[]>();
    getAllHumidityDevices = new ReplaySubject<IHumidityDevice[]>();

    TestBed.configureTestingModule({
      providers: [
        AnalogPortService,
        {provide: HumidityDeviceCacheService, useClass: HumidityDeviceCacheServiceMock},
        {provide: TemperatureDeviceCacheService, useClass: TemperatureDeviceCacheServiceMock},
        {provide: PortsService, useClass: PortsServiceMock},
      ]
    });
  });

  it('should create', inject([AnalogPortService, HumidityDeviceCacheService, TemperatureDeviceCacheService, PortsService],
    (service: AnalogPortService) => {
      expect(service).toBeTruthy();
    }));

  it('should unusedPorts AI_1 and AI_2',
    inject([AnalogPortService, HumidityDeviceCacheService, TemperatureDeviceCacheService, PortsService], (service: AnalogPortService) => {
      const unusedInputPortsObservable = service.getUnusedInputPorts();
      unusedInputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([Port.AI_1, Port.AI_2]);
      });
    }));

  it('should unusedPorts AI_1 (AI_2 used by tempDevice)',
    inject([AnalogPortService, HumidityDeviceCacheService, TemperatureDeviceCacheService, PortsService], (service: AnalogPortService) => {
      const unusedInputPortsObservable = service.getUnusedInputPorts();
      getAllTemperatureDevices.next([{port: Port.AI_2}]);
      unusedInputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([Port.AI_1]);
      });
    }));

  it('should unusedPorts AI_2 (AI_1 used by humidityDevice)',
    inject([AnalogPortService, HumidityDeviceCacheService, TemperatureDeviceCacheService, PortsService], (service: AnalogPortService) => {
      const unusedInputPortsObservable = service.getUnusedInputPorts();
      getAllHumidityDevices.next([{port: Port.AI_1}]);
      unusedInputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([Port.AI_2]);
      });
    }));

  it('should unusedPorts empty (AI_1 used by humidityDevice, AI_2 used by tempDevice)',
    inject([AnalogPortService, HumidityDeviceCacheService, TemperatureDeviceCacheService, PortsService], (service: AnalogPortService) => {
      const unusedInputPortsObservable = service.getUnusedInputPorts();
      getAllHumidityDevices.next([{port: Port.AI_1}]);
      getAllTemperatureDevices.next([{port: Port.AI_2}]);
      unusedInputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([]);
      });
    }));
});

class TemperatureDeviceCacheServiceMock {
  public getAll(): ReplaySubject<ITemperatureDevice[]> {
    return getAllTemperatureDevices;
  }
}

class HumidityDeviceCacheServiceMock {
  public getAll(): ReplaySubject<IHumidityDevice[]> {
    return getAllHumidityDevices;
  }
}

class PortsServiceMock {
  public getAnalogInputs(): Port[] {
    return [Port.AI_1, Port.AI_2];
  }
}
