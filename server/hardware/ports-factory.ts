import {Logger, getLogger} from '../utils/logger';
import fs = require('fs');
import {AIN, GPIO, LED} from './beaglebone-ports';
import {SimulatedAIN, SimulatedGPIO, SimulatedLED} from './simulation-ports';
import {AbstractAIN, AbstractGPIO, AbstractLED, Direction} from './abstract-ports';
import {Port, portName, analogInputs, digitalInputs, digitalOutputs} from './port-map';
import {SimulationCommandHandler} from "./simulation-command-handler";

const LOGGER: Logger = getLogger('PortsFactory');

export class PortsFactory {
  private readonly USE_BBB_SCHEMA_FOR_SIMULATION = true;

  private static singleton: PortsFactory = new PortsFactory();
  private isBBB: boolean = false;
  private portToBeagleBoneBlackId: Map<Port, number> = new Map<Port, number>();

  private constructor() {
    this.isBBB = PortsFactory.isBeagleBoneBlack();
    this.createPortToPinMap();
  }

  public static getInstance(): PortsFactory {
    return PortsFactory.singleton;
  }

  private static isBeagleBoneBlack(): boolean {
    let boardInfoFile: string = '/sys/devices/platform/bone_capemgr/baseboard/board-name';
    if (fs.existsSync(boardInfoFile)) {
      let name: string = fs.readFileSync(boardInfoFile, 'utf-8');
      if (name.toUpperCase().startsWith('A335BNLT')) {
        LOGGER.info('BeagleBone Black detected!');
        return true;
      } else {
        LOGGER.warn(`${name} is not a BeagleBone Black --> using hardware simulation!`);
      }
    } else {
      LOGGER.warn('not running on a beaglebone --> using hardware simulation!');
    }
    SimulationCommandHandler.getInstance();

    return false;
  }

  public getAIN(port: Port): AbstractAIN {
    if (analogInputs.filter(p => p != port).length === 0) {
      throw new Error(`Port ${portName(port)} is not a valid anaog input`);
    }
    if (this.isBBB) {
      return new AIN(this.portToBeagleBoneBlackId.get(port));
    } else {
      return new SimulatedAIN(this.translateSimulatedPort(port));
    }
  }

  public getDigitalInput(port: Port): AbstractGPIO {
    if (digitalInputs.filter(p => p != port).length === 0) {
      throw new Error(`Port ${portName(port)} is not a valid digital input`);
    }
    if (this.isBBB) {
      return new GPIO(this.portToBeagleBoneBlackId.get(port), Direction.INPUT);
    } else {
      return new SimulatedGPIO(this.translateSimulatedPort(port), Direction.INPUT);
    }
  }

  public getDigitalOutput(port: Port): AbstractGPIO {
    if (digitalOutputs.filter(p => p != port).length === 0) {
      throw new Error(`Port ${portName(port)} is not a valid digital output`);
    }
    if (this.isBBB) {
      return new GPIO(this.portToBeagleBoneBlackId.get(port), Direction.OUTPUT);
    } else {
      return new SimulatedGPIO(this.translateSimulatedPort(port), Direction.OUTPUT);
    }
  }

  public getLED(id: number): AbstractLED {
    if (this.isBBB) {
      return new LED(id);
    } else {
      return new SimulatedLED(id);
    }
  }

  private translateSimulatedPort(port: Port): number {
    if (this.USE_BBB_SCHEMA_FOR_SIMULATION) {
      let id: number = this.portToBeagleBoneBlackId.get(port);
      return id;
    } else {
      return port;
    }
  }

  private createPortToPinMap(): void {
    this.portToBeagleBoneBlackId.set(Port.AI_1, 0);
    this.portToBeagleBoneBlackId.set(Port.AI_2, 1);
    this.portToBeagleBoneBlackId.set(Port.AI_3, 2);
    this.portToBeagleBoneBlackId.set(Port.AI_4, 3);
    this.portToBeagleBoneBlackId.set(Port.AI_5, 4);
    this.portToBeagleBoneBlackId.set(Port.AI_6, 5);
    this.portToBeagleBoneBlackId.set(Port.AI_7, 6);

    this.portToBeagleBoneBlackId.set(Port.DI_1, 47);
    this.portToBeagleBoneBlackId.set(Port.DI_2, 45);
    this.portToBeagleBoneBlackId.set(Port.DI_3, 26);
    this.portToBeagleBoneBlackId.set(Port.DI_4, 44);
    this.portToBeagleBoneBlackId.set(Port.DI_5, 46);
    this.portToBeagleBoneBlackId.set(Port.DI_6, 27);
    this.portToBeagleBoneBlackId.set(Port.DI_7, 65);
    this.portToBeagleBoneBlackId.set(Port.DI_8, 61);

    this.portToBeagleBoneBlackId.set(Port.DO_1, 60);
    this.portToBeagleBoneBlackId.set(Port.DO_2, 48);
    this.portToBeagleBoneBlackId.set(Port.DO_3, 49);
    this.portToBeagleBoneBlackId.set(Port.DO_4, 69);
    this.portToBeagleBoneBlackId.set(Port.DO_5, 115);
    this.portToBeagleBoneBlackId.set(Port.DO_6, 20);
    this.portToBeagleBoneBlackId.set(Port.DO_7, 66);
    this.portToBeagleBoneBlackId.set(Port.DO_8, 7);
  }

}
