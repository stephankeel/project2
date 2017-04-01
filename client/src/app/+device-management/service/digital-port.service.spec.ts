import {TestBed, inject} from '@angular/core/testing';

import {DigitalPortService} from './digital-port.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IBlindsDevice} from '../../../../../server/entities/device.interface';
import {BlindsDeviceCacheService} from '../../cache/service/blinds-device.cache.service';
import {Port} from '../../../../../server/hardware/port-map';
import {PortsService} from './ports.service';


let getAllBlindDevices: ReplaySubject<IBlindsDevice[]>;

describe('DigitalPortService', () => {

  beforeEach(() => {
    getAllBlindDevices = new ReplaySubject<IBlindsDevice[]>();

    TestBed.configureTestingModule({
      providers: [
        DigitalPortService,
        {provide: BlindsDeviceCacheService, useClass: BlindsDeviceCacheServiceMock},
        {provide: PortsService, useClass: PortsServiceMock},
      ]
    });
  });

  it('should ...', inject([DigitalPortService, BlindsDeviceCacheService, PortsService],
    (service: DigitalPortService) => {
      expect(service).toBeTruthy();
    }));

  it('should unusedInputPorts all', inject([DigitalPortService, BlindsDeviceCacheService, PortsService],
    (service: DigitalPortService) => {
      const unusedInputPortsObservable = service.getUnusedInputPorts();
      unusedInputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([Port.DI_1, Port.DI_2]);
      });
    }));

  it('should no unused input ports', inject([DigitalPortService, BlindsDeviceCacheService, PortsService],
    (service: DigitalPortService) => {
      const unusedInputPortsObservable = service.getUnusedInputPorts();
      getAllBlindDevices.next([{keyDown: Port.DI_1, keyUp: Port.DI_2, actorUp: Port.DO_1, actorDown: Port.DO_2}]);
      unusedInputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([]);
      });
    }));

  it('should unusedOutputPorts all', inject([DigitalPortService, BlindsDeviceCacheService, PortsService],
    (service: DigitalPortService) => {
      const unusedOutputPortsObservable = service.getUnusedOutputPorts();
      unusedOutputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([Port.DO_1, Port.DO_2]);
      });
    }));

  it('should no unused output ports', inject([DigitalPortService, BlindsDeviceCacheService, PortsService],
    (service: DigitalPortService) => {
      const unusedOutputPortsObservable = service.getUnusedOutputPorts();
      getAllBlindDevices.next([{keyDown: Port.DI_1, keyUp: Port.DI_2, actorUp: Port.DO_1, actorDown: Port.DO_2}]);
      unusedOutputPortsObservable.subscribe(ports => {
        expect(ports).toEqual([]);
      });
    }));

});

class BlindsDeviceCacheServiceMock {
  public getAll(): ReplaySubject<IBlindsDevice[]> {
    return getAllBlindDevices;
  }
}


class PortsServiceMock {
  public getDigitalOutputs(): Port[] {
    return [Port.DO_1, Port.DO_2];
  }

  public getDigitalInputs(): Port[] {
    return [Port.DI_1, Port.DI_2];
  }
}
