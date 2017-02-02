import {logger} from '../utils/logger';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Direction, I_AIN, I_GPIO, I_LED} from '../hardware/ports.interface';

export class SimulatedGPIO implements I_GPIO {

  private outputObs: Observable<boolean> = null;

  constructor(private id: number, private direction: Direction) {
  }

  getName(): string {
    return `simulated gpio${this.id} direction ${this.directionVerb()}`;
  }

  directionVerb(): string {
    switch (this.direction) {
      case Direction.INPUT:
        return 'in';
      case Direction.OUTPUT:
        return 'out';
      default:
        return null;
    }
  }

  setState(on: boolean): void {
    let state: number = on ? 1 : 0;
    logger.info(`Simulation: setState ${this.getName()} to ${state}`);
  }

  watch(): Observable<boolean> {
    if (this.direction === Direction.OUTPUT) {
      if (this.outputObs === null) {
        this.outputObs = Observable.create((subscriber: Subscriber<boolean>) => {
          let cmd: string = `${this.getName()}/value`;
          logger.debug(`watch ${cmd}`);
          logger.info(`TODO: implement output port simulator`);
        });
      }
      return this.outputObs;
    } else {
      logger.error(`watch ${this.getName()} not allowed for input pin`);
    }
  }

  reset(): void {
    logger.info(`TODO: implement reset simulator`);
  }

  toString(): string {
    let portName: string = `${this.getName()}`;
    let str = `${portName}: direction ${this.directionVerb()}`;
    if (this.direction === Direction.OUTPUT) {
      str += `, edge on $[both]`;
    }
    return str;
  }
}

export class SimulatedAIN {

  private outputObs: Observable<number> = null;
  private intervalId: any = null;
  private doPoll: boolean = true;

  constructor(private id: number) {
  }

  getName(): string {
    return `simulated ain${this.id}`;
  }

  poll(intervalSeconds: number): Observable<number> {
    if (this.outputObs === null) {
      this.outputObs = Observable.create((subscriber: Subscriber<number>) => {
        logger.debug(`poll ${this.getName()} every ${intervalSeconds} second(s)`);
        this.doPoll = true;
        this.intervalId = setInterval(() => {
          if (this.doPoll) {
            // TODO: pprovide simulated value between 0 and 4095
            subscriber.next(1234);
          }
        }, intervalSeconds * 1000);
      });
    }
    return this.outputObs;
  }

  stopPolling(): void {
    logger.debug(`stopPolling ${this.getName()}`);
    this.doPoll = false;
  }
}

export class SimulatedLED {
  constructor(private id: number) {
  }

  getName(): string {
    return `simulated led${this.id}`;
  }

  setState(state: number): void {
    logger.info(`Simulation: setState ${this.getName()} to ${state}`);
  }

  blink(delayOn: number, delayOff: number): void {
    logger.info(`Simulation: blink ${this.getName()} with on ${delayOn} and off ${delayOff}`);
  }

  heartbeat(): void {
    logger.info(`Simulation: heartbeat ${this.getName()}`);
  }
}
