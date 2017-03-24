import {getLogger, Logger} from '../utils/logger';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';
import {Direction, AbstractAIN, AbstractGPIO, AbstractLED} from './abstract-ports';
import {SimulationCommandHandler} from "./simulation-command-handler";


export class SimulatedGPIO extends AbstractGPIO {
  private static readonly logger: Logger = getLogger('SimulatedGPIO');
  private outputObs: Observable<boolean> = null;
  private doRead: boolean = true;
  private keyPressed: boolean = false;
  private cmdSubscription: Subscription;

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
    if (this.direction === Direction.OUTPUT) {
      let state: number = on ? 1 : 0;
      SimulatedGPIO.logger.info(`Simulation: setState ${this.getName()} to ${state}`);
    } else {
      SimulatedGPIO.logger.error(`setState ${this.getName()} not allowed for input pin`);
    }
  }

  watch(): Observable<boolean> {
    if (this.direction === Direction.INPUT) {
      if (this.outputObs === null) {
        this.cmdSubscription = commandListener('gpi', this.id, (cmd: string) => {
          let parts: string[] = cmd.split(' ');
          if (parts.length > 2 && parts[2]) {
            let value: number = +parts[2];
            if (!isNaN(value)) {
              console.log(`setting GPI ${this.id} from ${this.keyPressed} to ${value != 0}`);
              this.keyPressed = value != 0;
            }
          }
        });
        this.outputObs = Observable.create((subscriber: Subscriber<boolean>) => {
          let cmd: string = `${this.getName()}/value`;
          SimulatedGPIO.logger.info(`Simulation: watch ${cmd}`);
          this.doRead = true;
          let prevState: boolean = this.keyPressed;
          let intervalId = setInterval(() => {
            if (this.doRead) {
              if (this.keyPressed != prevState) {
                subscriber.next(this.keyPressed);
                prevState = this.keyPressed;
              }
            } else {
              subscriber.complete();
              clearInterval(intervalId);
            }
          }, 100);
        });
      }
      return this.outputObs;
    } else {
      SimulatedGPIO.logger.error(`watch ${this.getName()} not allowed for output pin`);
    }
  }

  reset(): void {
    SimulatedGPIO.logger.info(`Simulation: reset ${this.getName()} --> for gpio${this.id}`);
    this.doRead = false;
    if (this.cmdSubscription) {
      this.cmdSubscription.unsubscribe();
    }
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
  private static readonly logger: Logger = getLogger('SimulatedAIN');

  private outputObs: Observable<number> = null;
  private doPoll: boolean = true;
  private generatedValue: number = 20 + this.id;
  private sign: number = 1;
  private cmdSubscription: Subscription;

  constructor(protected id: number) {
    super(id);
  }

  getName(): string {
    return `simulated ain${this.id}`;
  }

  poll(intervalSeconds: number): Observable<number> {
    if (this.outputObs === null) {
      this.cmdSubscription = commandListener('ain', this.id, (cmd: string) => {
        let parts: string[] = cmd.split(' ');
        if (parts.length > 2 && parts[2]) {
          let value: number = +parts[2];
          if (!isNaN(value)) {
            console.log(`setting AIN ${this.id} from ${this.generatedValue} to ${value}`);
            this.generatedValue = value;
          }
        }
      });
      this.outputObs = Observable.create((subscriber: Subscriber<number>) => {
        SimulatedAIN.logger.debug(`poll ${this.getName()} every ${intervalSeconds} second(s)`);
        this.doPoll = true;

        let intervalId = setInterval(() => {
          if (this.doPoll) {
            this.generateNextValue();
            subscriber.next(this.generatedValue);
          } else {
            subscriber.complete();
            clearInterval(intervalId);
          }
        }, intervalSeconds * 1000);
      });
    }
    return this.outputObs;
  }

  private setInitialValue(subscriber: Subscriber<number>) {
    this.generateNextValue();
    subscriber.next(this.generatedValue);
  }

  private generateNextValue() {
    // provide simulated value between 0 and 4095 max!
    if (this.generatedValue > 30) {
      this.sign = -1;
    } else if (this.generatedValue < 15) {
      this.sign = 1;
    }
    this.generatedValue += this.sign * 0.1;
  }

  stopPolling(): void {
    SimulatedAIN.logger.debug(`stopPolling ${this.getName()}`);
    this.doPoll = false;
    if (this.cmdSubscription) {
      this.cmdSubscription.unsubscribe();
    }
  }
}

export class SimulatedLED extends AbstractLED {
  private static readonly logger: Logger = getLogger('SimulatedLED');

  constructor(protected id: number) {
    super(id);
  }

  getName(): string {
    return `simulated led${this.id}`;
  }

  setState(state: number): void {
    SimulatedLED.logger.info(`Simulation: setState ${this.getName()} to ${state}`);
  }

  blink(delayOn: number, delayOff: number): void {
    SimulatedLED.logger.info(`Simulation: blink ${this.getName()} with on ${delayOn} and off ${delayOff}`);
  }

  heartbeat(): void {
    SimulatedLED.logger.info(`Simulation: heartbeat ${this.getName()}`);
  }
}


function commandListener(cmdTag: string, portId: number, executeCommand: (cmd: string) => void): Subscription {
  return SimulationCommandHandler.getInstance().getCommandObservable().subscribe((cmd: string) => {
    if (cmd.startsWith(`${cmdTag} ${portId} `)) {
      console.log(`execute cmd ${cmd}`);
      executeCommand(cmd);
    }
  });
}
