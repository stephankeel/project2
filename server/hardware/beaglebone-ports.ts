import {Logger, getLogger} from '../utils/logger';
import fs = require('fs');
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Direction, AbstractAIN, AbstractGPIO, AbstractLED} from './abstract-ports';

export class GPIO extends AbstractGPIO {
  public static readonly VALID_IDS: number[] = [2, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 20, 26, 27, 44, 45, 46, 47, 48, 49, 60, 61, 65, 66, 69, 115];
  private static readonly logger: Logger = getLogger('GPIO');
  private static readonly ROOT = '/sys/class/gpio/';
  private static readonly UNEXPORT = GPIO.ROOT + 'unexport';
  private static readonly EXPORT = GPIO.ROOT + 'export';
  private static readonly BASE_NAME = 'gpio';

  private outputObs: Observable<boolean> = null;
  private intervalId: any = null;
  private prevValue: number = 48; // ascii 0

  constructor(protected id: number, private direction: Direction) {
    super(id);
    if (GPIO.VALID_IDS.filter(vid => vid != id).length === 0) {
      throw new Error(`GPIO id ${id} is not valid!`);
    }
    let portName: string = this.getName();
    // activate port if not yet done
    if (!fs.existsSync(portName)) {
      let cmd: string = `${GPIO.EXPORT}`;
      fs.writeFileSync(cmd, id);
      GPIO.logger.debug(`enable port id ${id}`);
    }
    // set port direction
    let cmd = `${portName}/direction`;
    fs.writeFileSync(cmd, this.directionVerb());
    GPIO.logger.debug(`port ${id} direction ${this.directionVerb()}`);
    // if output then set mode to edge
    if (this.direction === Direction.INPUT) {
      cmd = `${portName}/edge`;
      fs.writeFileSync(cmd, 'none');
      GPIO.logger.debug(`port ${id} edge on both`);
    } else {
      this.setState(false);
    }
  }

  getName(): string {
    return `${GPIO.ROOT}${GPIO.BASE_NAME}${this.id}`;
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
      let cmd: string = `${this.getName()}/value`;
      let state: number = on ? 0 : 1; // on = 0, off = 1, i.e. inverted
      GPIO.logger.debug(`setState ${cmd} to ${state}`);
      if (fs.existsSync(cmd)) {
        fs.writeFileSync(cmd, state);
        GPIO.logger.debug('done');
      } else {
        GPIO.logger.error(`setState failed: ${cmd} does not exit`);
      }
    } else {
      GPIO.logger.error(`setState ${this.getName()} not allowed for input pin`);
    }
  }

  watch(): Observable<boolean> {
    if (this.direction === Direction.INPUT) {
      if (this.outputObs === null) {
        this.outputObs = Observable.create((subscriber: Subscriber<boolean>) => {
          let cmd: string = `${this.getName()}/value`;
          GPIO.logger.debug(`watch ${cmd}`);
          if (fs.existsSync(cmd)) {
            this.read(subscriber, cmd);
          } else {
            subscriber.error(`watch failed: ${cmd} does not exist`);
            subscriber.complete();
          }
        });
      }
      return this.outputObs;
    } else {
      GPIO.logger.error(`watch ${this.getName()} not allowed for output pin`);
    }
  }

  private read(subscriber: Subscriber<boolean>, cmd: string, value?: boolean): void {
    this.intervalId = setInterval(() => {
      let data: Buffer = fs.readFileSync(cmd);
      if (data) {
        let val: number = data.readUInt8(0); // ascii value of 0 = 48, of 1 = 49
        if (val !== this.prevValue) {
          GPIO.logger.debug(`${this.getName()} input is ${val !== 48}`)
          subscriber.next(val !== 48);
          this.prevValue = val;
        }
      } else {
        let errStr: string = `read ${cmd} failed with no data`;
        GPIO.logger.error(errStr);
        subscriber.error(errStr);
        subscriber.complete();
        clearInterval(this.intervalId);
      }
    }, 100);
  }

  reset(): void {
    GPIO.logger.debug(`reset ${this.getName()} --> ${GPIO.UNEXPORT} for gpio${this.id}`);
    if (fs.existsSync(this.getName())) {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
      fs.writeFileSync(GPIO.UNEXPORT, this.id);
      GPIO.logger.debug('done');
    } else {
      GPIO.logger.error(`Reset failed: ${this.getName()} does not exit`);
    }
  }

  toString(): string {
    let portName: string = `${this.getName()}`;
    if (fs.existsSync(portName)) {
      let direction = fs.readFileSync(`${portName}}/direction`);
      let edge = fs.readFileSync(`${portName}}/edge`);
      let str = `${portName}: direction ${direction} [${this.directionVerb()}]`;
      if (this.direction === Direction.OUTPUT) {
        str += `, edge on ${edge} [none]`;
      }
      return str;
    } else {
      return `Unexpected: ${portName} does not exist!`;
    }
  }
}


export class AIN extends AbstractAIN {
  public static readonly VALID_IDS: number[] = [0, 1, 2, 3, 4, 5, 6];
  public static readonly MAX_VALUE: number = 4096;
  private static readonly logger: Logger = getLogger('AIN');
  private static readonly ROOT = '/sys/bus/iio/devices/iio:device0/';
  private static readonly BASE_NAME = 'in_voltage';
  private static readonly POST_FIX = '_raw';

  private outputObs: Observable<number> = null;
  private intervalId: any = null;
  private doPoll: boolean = true;

  constructor(protected id: number) {
    super(id);
    if (AIN.VALID_IDS.filter(vid => vid != id).length === 0) {
      throw new Error(`AIN id ${id} is not valid!`);
    }
  }

  getName(): string {
    return `${AIN.ROOT}${AIN.BASE_NAME}${this.id}${AIN.POST_FIX}`;
  }

  poll(intervalSeconds: number): Observable<number> {
    if (this.outputObs === null) {
      this.outputObs = Observable.create((subscriber: Subscriber<number>) => {
        AIN.logger.debug(`poll ${this.getName()} every ${intervalSeconds} second(s)`);
        if (fs.existsSync(this.getName())) {
          this.doPoll = true;
          this.intervalId = setInterval(() => {
            if (this.doPoll) {
              fs.readFile(this.getName(), (err, data) => {
                if (err) {
                  subscriber.error(`read ${this.getName()} failed with ${err}`);
                } else {
                  let val: number = Number(data.toString());
                  AIN.logger.debug(`${this.getName()}: data: ${JSON.stringify(data)} --> val: ${val}`);
                  subscriber.next(val);
                }
              });
            } else {
              subscriber.complete();
            }
          }, intervalSeconds * 1000);
        } else {
          subscriber.error(`poll failed: ${this.getName()} does not exist`);
          subscriber.complete();
        }
      });
    }
    return this.outputObs;
  }

  stopPolling(): void {
    AIN.logger.debug(`stopPolling ${this.getName()}`);
    clearInterval(this.intervalId);
    this.doPoll = false;
  }

}


export class LED extends AbstractLED {
  public static readonly VALID_IDS: number[] = [0, 1, 2, 3];
  private static readonly logger: Logger = getLogger('SimulatedGPIO');
  private static readonly ROOT = '/sys/class/leds/';
  private static readonly BASE_NAME = 'beaglebone:green:usr';

  constructor(protected id: number) {
    super(id);
    if (LED.VALID_IDS.filter(vid => vid != id).length === 0) {
      throw new Error(`LED id ${id} is not valid!`);
    }
    this.setState(0);
  }

  getName(): string {
    return `${LED.ROOT}${LED.BASE_NAME}${this.id}`;
  }

  setState(state: number): void {
    let cmd: string = `${this.getName()}/brightness`;
    LED.logger.debug(`setState ${cmd} to ${state}`);
    if (fs.existsSync(cmd)) {
      fs.writeFileSync(cmd, state);
    } else {
      LED.logger.error(`setState ${state} failed: ${cmd} does not exist`);
    }
  }

  blink(delayOn: number, delayOff: number): void {
    let cmdTimer: string = `${this.getName()}/trigger`;
    let cmdOn: string = `${this.getName()}/delay_on`;
    let cmdOff: string = `${this.getName()}/delay_off`;
    LED.logger.debug(`blink ${cmdTimer} with ${delayOn}-${delayOff}`);
    if (fs.existsSync(cmdTimer)) {
      fs.writeFileSync(cmdTimer, 'timer');
      fs.writeFileSync(cmdOn, delayOn);
      fs.writeFileSync(cmdOff, delayOff);
    } else {
      LED.logger.error(`blink ${delayOn}-${delayOff} failed: ${cmdTimer} does not exist`);
    }
  }

  heartbeat(): void {
    let cmd: string = `${this.getName()}/trigger`;
    let value: string = 'heartbeat';
    LED.logger.debug(`heartbeat ${cmd} to ${value}`);
    if (fs.existsSync(cmd)) {
      fs.writeFileSync(cmd, value);
    } else {
      LED.logger.error(`heatbeat ${value} failed: ${cmd} does not exist`);
    }
  }
}
