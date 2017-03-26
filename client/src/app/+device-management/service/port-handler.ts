import {Port} from "../../../../../server/hardware/port-map";
import {Observable, ReplaySubject, Subscription} from "rxjs";

/**
 * This class gets an observer with the unused ports, and add's
 * the register port and returns an observable with available ports.
 */

export class PortHandler {

  private unusedPorts: ReplaySubject<Port[]> = new ReplaySubject<Port[]>(1);
  private portObserverUnusedPorts: Port[] = [];
  private registeredCurrentPorts: Port[] = [];
  private subscription: Subscription;

  constructor(private portObserver: () => Observable<Port[]>) {
    this.subscription = portObserver().subscribe(ports => {
      this.portObserverUnusedPorts = ports;
      this.updateAvailablePorts();
    })
  };

  public getAvailablePorts(): Observable<Port[]> {
    return this.unusedPorts;
  }

  private updateAvailablePorts() {
    let result: Port[] = Array.from(this.portObserverUnusedPorts);
    result.push(...this.registeredCurrentPorts);
    result.sort();
    this.unusedPorts.next(result);
  }

  public registerPorts(ports: Port[]) {
    this.registeredCurrentPorts = ports;
    this.updateAvailablePorts();
  }
}
