import {Injectable} from '@angular/core';
import {BlindsDeviceCacheService} from '../../cache/service/blinds-device.cache.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IBlindsDevice} from '../../../../../server/entities/device.interface';
import {Port} from '../../../../../server/hardware/port-map';
import {PortsService} from './ports.service';

@Injectable()
export class DigitalPortService {

  private unusedInputPorts: ReplaySubject<Port[]> = new ReplaySubject<Port[]>(1);
  private unusedOutputPorts: ReplaySubject<Port[]> = new ReplaySubject<Port[]>(1);

  constructor(private blindsDeviceCacheService: BlindsDeviceCacheService,
              private portsService: PortsService) {
    this.unusedInputPorts.next(this.computeUnusedInputPorts([]));
    this.unusedOutputPorts.next(this.computeUnusedOutputPorts([]));
    this.init();
  }

  public getUnusedInputPorts(): Observable<Port[]> {
    return this.unusedInputPorts;
  }

  public getUnusedOutputPorts(): Observable<Port[]> {
    return this.unusedOutputPorts;
  }

  private init() {
    this.blindsDeviceCacheService.getAll().subscribe(items => {
      this.unusedInputPorts.next(this.computeUnusedInputPorts(items));
      this.unusedOutputPorts.next(this.computeUnusedOutputPorts(items));
    });
  }

  private computeUnusedInputPorts(itemList: IBlindsDevice[]): Port[] {
    return this.computeUnusedPorts(itemList, this.portsService.getDigitalInputs(), item => item.keyDown, item => item.keyUp);
  }

  private computeUnusedOutputPorts(itemList: IBlindsDevice[]): Port[] {
    return this.computeUnusedPorts(itemList, this.portsService.getDigitalOutputs(), item => item.actorDown, item => item.actorUp);
  }

  private computeUnusedPorts(itemList: IBlindsDevice[], availablePorts: Port[],
                             down: (item: IBlindsDevice) => Port, up: (item: IBlindsDevice) => Port): Port[] {
    const unusedPorts: Set<Port> = new Set<Port>(availablePorts);
    itemList.forEach(item => {
      unusedPorts.delete(up(item));
      unusedPorts.delete(down(item));
    });
    return Array.from(unusedPorts);
  }
}
