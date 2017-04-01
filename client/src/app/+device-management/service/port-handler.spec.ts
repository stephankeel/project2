import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Port} from '../../../../../server/hardware/port-map';
import {PortHandler} from './port-handler';

let unusedPortObservable: ReplaySubject<Port[]>;
let portHandler: PortHandler;

describe('PortsHandler', () => {
  beforeEach(() => {
    unusedPortObservable = new ReplaySubject<Port[]>(1);
    portHandler = new PortHandler(() => unusedPortObservable);
  });

  it('should available ports empty', () => {
    const availablePortsObservable = portHandler.getAvailablePorts();
    unusedPortObservable.next([]);
    availablePortsObservable.subscribe(ports => {
      expect(ports).toEqual([]);
    });
  });

  it('should available ports equals input', () => {
    const availablePortsObservable = portHandler.getAvailablePorts();
    unusedPortObservable.next([Port.AI_1]);
    availablePortsObservable.subscribe(ports => {
      expect(ports).toEqual([Port.AI_1]);
    });
  });

  it('should available ports equals input ports and registered ports', () => {
    const availablePortsObservable = portHandler.getAvailablePorts();
    unusedPortObservable.next([Port.AI_1]);
    portHandler.registerPorts([Port.AI_2]);
    availablePortsObservable.subscribe(ports => {
      expect(ports).toEqual([Port.AI_1, Port.AI_2]);
    });
  });

  it('should available ports equals input incl registered, input ports change', () => {
    const availablePortsObservable = portHandler.getAvailablePorts();
    unusedPortObservable.next([Port.AI_1]);
    portHandler.registerPorts([Port.AI_2]);
    const sub = availablePortsObservable.subscribe(ports => {
      // is called immediately, because the availablePortsObservable is a ReplaySubject and has already a value and returns this immediately
      expect(ports).toEqual([Port.AI_1, Port.AI_2]);
    });
    sub.unsubscribe();
    unusedPortObservable.next([Port.AI_1, Port.AI_3]);
    availablePortsObservable.subscribe(ports => {
      expect(ports).toEqual([Port.AI_1, Port.AI_2, Port.AI_3]);
    });
  });
});
