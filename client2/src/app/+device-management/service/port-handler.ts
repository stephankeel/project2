import {Port} from "../../../../../server/hardware/port-map";
import {Observable, ReplaySubject, Subscription} from "rxjs";
export class PortHandler {

  private unusedPorts: ReplaySubject<Port[]> = new ReplaySubject<Port[]>();
  private portObserverUnusedPorts: Port[] = [];
  private registeredUnusedPorts: Port[] = [];
  private subscription: Subscription;

  constructor(private portObserver: () => Observable<Port[]>) {
    this.subscription = portObserver().subscribe(ports => {
      this.portObserverUnusedPorts = ports;
      this.updateUnusedPorts();
    })
  };

  public getUnusedPort() : Observable<Port[]>{
    return this.unusedPorts;
  }

  private updateUnusedPorts() {
    let result: Port[] = Array.from(this.portObserverUnusedPorts);
    result.push(...this.registeredUnusedPorts);
    result.sort();
    this.unusedPorts.next(result);
  }

  public registerPorts(ports: Port[]) {
    this.registeredUnusedPorts = ports;
    this.updateUnusedPorts();
  }

  public destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
