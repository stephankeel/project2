import {logger} from '../utils/logger';
import fs = require('fs');
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Direction, I_AIN, I_GPIO, I_LED} from '../hardware/ports.interface';

export class GPIO implements I_GPIO {
  public static readonly VALID_IDS: number[] = [2, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 20, 26, 27, 44, 45, 46, 47, 48, 49, 60, 61, 65, 66, 69, 115];
  private static readonly ROOT = '/sys/class/gpio/';
  private static readonly UNEXPORT = GPIO.ROOT + 'unexport';
  private static readonly EXPORT = GPIO.ROOT + 'export';
  private static readonly BASE_NAME = 'gpio';

  private outputObs: Observable<boolean> = null;

  constructor(private id: number, private direction: Direction) {
    let portName: string = this.getName();
    // activate port if not yet done
    if (!fs.existsSync(portName)) {
      let cmd: string = `${GPIO.ROOT}${GPIO.EXPORT}`;
      fs.writeFileSync(cmd, id);
      logger.debug(`enable port id ${id}`);
    }
    // set port direction
    let cmd = `${portName}/direction`;
    fs.writeFileSync(cmd, this.directionVerb());
    logger.debug(`port ${id} direction ${this.directionVerb()}`);
    // if output then set mode to edge
    if (this.direction === Direction.OUTPUT) {
      cmd = `${portName}/edge`;
      fs.writeFileSync(cmd, 'both');
      logger.debug(`port ${id} edge on both`);
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
    if (this.direction === Direction.INPUT) {
      let cmd: string = `${this.getName()}/value`;
      let state: number = on ? 1 : 0;
      logger.debug(`setState ${cmd} to ${state}`);
      if (fs.existsSync(cmd)) {
        fs.writeFileSync(cmd, state);
        logger.debug('done');
      } else {
        logger.error(`setState failed: ${cmd} does not exit`);
      }
    } else {
      logger.error(`setState ${this.getName()} not allowed for output pin`);
    }
  }

  watch(): Observable<boolean> {
    if (this.direction === Direction.OUTPUT) {
      if (this.outputObs === null) {
        this.outputObs = Observable.create((subscriber: Subscriber<boolean>) => {
          let cmd: string = `${this.getName()}/value`;
          logger.debug(`watch ${cmd}`);
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
      logger.error(`watch ${this.getName()} not allowed for input pin`);
    }
  }

  private read(subscriber: Subscriber<boolean>, cmd: string, value?: boolean): void {
    if (value != undefined) {
      subscriber.next(value);
    }
    fs.readFile(cmd, (err, data) => {
      if (err) {
        logger.error(`read ${cmd} failed with ${err}`);
      }
      let val: number = data.values()[0];
      this.read(subscriber, cmd, val == 0 ? false : true);
    });
  }

  reset(): void {
    logger.debug(`reset ${this.getName()} --> ${GPIO.UNEXPORT} for gpio${this.id}`);
    if (fs.existsSync(this.getName())) {
      fs.writeFileSync(GPIO.UNEXPORT, this.id);
      logger.debug('done');
    } else {
      logger.error(`Reset failed: ${this.getName()} does not exit`);
    }
  }

  toString(): string {
    let portName: string = `${this.getName()}`;
    if (fs.existsSync(portName)) {
      let direction = fs.readFileSync(`${portName}}/direction`);
      let edge = fs.readFileSync(`${portName}}/edge`);
      let str = `${portName}: direction ${direction} [${this.directionVerb()}]`;
      if (this.direction === Direction.OUTPUT) {
        str += `, edge on ${edge} [both]`;
      }
      return str;
    } else {
      return `Unexpected: ${portName} does not exist!`;
    }
  }
}


export class AIN implements I_AIN {
  public static readonly VALID_IDS: number[] = [0, 1, 2, 3, 4, 5, 6];
  private static readonly ROOT = '/sys/bus/iio/devices/iio:device0/';
  private static readonly BASE_NAME = 'in_voltage';
  private static readonly POST_FIX = '_raw';

  private outputObs: Observable<number> = null;
  private intervalId: any = null;
  private doPoll: boolean = true;

  constructor(private id: number) {
  }

  getName(): string {
    return `${AIN.ROOT}${AIN.BASE_NAME}${this.id}${AIN.POST_FIX}`;
  }

  poll(intervalSeconds: number): Observable<number> {
    if (this.outputObs === null) {
      this.outputObs = Observable.create((subscriber: Subscriber<number>) => {
        logger.debug(`poll ${this.getName()} every ${intervalSeconds} second(s)`);
        if (fs.existsSync(this.getName())) {
          this.doPoll = true;
          this.intervalId = setInterval(() => {
            if (this.doPoll) {
              fs.readFile(this.getName(), (err, data) => {
                if (err) {
                  subscriber.error(`read ${this.getName()} failed with ${err}`);
                } else {
                  let val: number = data.values()[0];
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
    logger.debug(`stopPolling ${this.getName()}`);
    this.doPoll = false;
  }

}


export class LED implements I_LED {
  public static readonly VALID_IDS: number[] = [0, 1, 2, 3];
  private static readonly ROOT = '/sys/class/leds/';
  private static readonly BASE_NAME = 'beaglebone:green:usr';

  private intervalId: any = null;

  constructor(private id: number) {
    this.setState(0);
  }

  getName(): string {
    return `${LED.ROOT}${LED.BASE_NAME}${this.id}`;
  }

  setState(state: number): void {
    let cmd: string = `${this.getName()}/brightness`;
    logger.debug(`setState ${cmd} to ${state}`);
    if (fs.existsSync(cmd)) {
      fs.writeFileSync(cmd, state);
    } else {
      logger.error(`setState ${state} failed: ${cmd} does not exist`);
    }
  }

  blink(delayOn: number, delayOff: number): void {
    let cmdTimer: string = `${this.getName()}/trigger`;
    let cmdOn: string = `${this.getName()}/delay_on`;
    let cmdOff: string = `${this.getName()}/delay_off`;
    logger.debug(`blink ${cmdTimer} with ${delayOn}-${delayOff}`);
    if (fs.existsSync(cmdTimer)) {
      fs.writeFileSync(cmdTimer, 'timer');
      fs.writeFileSync(cmdOn, delayOn);
      fs.writeFileSync(cmdOff, delayOff);
    } else {
      logger.error(`blink ${delayOn}-${delayOff} failed: ${cmdTimer} does not exist`);
    }
  }

  heartbeat(): void {
    let cmd: string = `${this.getName()}/trigger`;
    let value: string = 'heartbeat';
    logger.debug(`heartbeat ${cmd} to ${value}`);
    if (fs.existsSync(cmd)) {
      fs.writeFileSync(cmd, value);
    } else {
      logger.error(`heatbeat ${value} failed: ${cmd} does not exist`);
    }
  }
}
