import {logger} from '../utils/logger';
import fs = require('fs');
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {I_AIN, I_LED, I_GPIO, Direction} from '../hardware/ports.interface';
import {AIN, LED, GPIO} from '../hardware/beaglebone-ports';
import {SimulatedAIN, SimulatedLED, SimulatedGPIO} from "../hardware/simulation-ports";

export class Engine {
  private static singleton = new Engine();
  private isBBB: boolean = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): Engine {
    return Engine.singleton;
  }

  private isBeagleBoneBlack() {
    let boardInfoFile: string = '/sys/devices/platform/bone_capemgr/baseboard/board-name';
    if (fs.existsSync(boardInfoFile)) {
      let name: string = fs.readFileSync(boardInfoFile, 'utf-8');
      if (name === 'A335BNLT') {
        logger.info('BeagleBone Black detected!');
        return true;
      } else {
        logger.warn(`${name} is not a BeagleBone Black --> using hardware simulation!`);
      }
    } else {
      logger.warn('not running on a beaglebone --> using hardware simulation!');
    }
    return false;
  }

  private init() {
    let led: I_LED;

    this.isBBB = this.isBeagleBoneBlack();
    if (this.isBBB) {
      led = new LED(3);
    } else {
      led = new SimulatedLED(3);
    }
    led.heartbeat();

  }


}

