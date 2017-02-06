import {logger} from '../utils/logger';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Direction, AbstractAIN, AbstractGPIO, AbstractLED} from './abstract-ports';

export class SimulatedGPIO extends AbstractGPIO {

  private outputObs: Observable<boolean> = null;

  constructor(protected id: number, private direction: Direction) {
    super(id);
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
          subscriber.next(true);
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

export class SimulatedAIN extends AbstractAIN {

  private outputObs: Observable<number> = null;
  private intervalId: any = null;
  private doPoll: boolean = true;
  private generatedValue: number = 20;
  private sign: number = 1;

  constructor(protected id: number) {
    super(id);
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
            // provide simulated value between 0 and 4095 max!
            if (this.generatedValue > 30) {
              this.sign = -1;
            } else if (this.generatedValue < 15) {
              this.sign = 1;
            }
            this.generatedValue += this.sign * 0.1;
            subscriber.next(this.generatedValue);
          } else {
            subscriber.complete();
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

export class SimulatedLED extends AbstractLED {
  constructor(protected id: number) {
    super(id);
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
