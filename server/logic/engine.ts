import {getLogger} from '../utils/logger';
import {Logger} from "log4js";
import {AbstractAIN, AbstractLED, AbstractGPIO, Direction} from '../hardware/abstract-ports';
import {IAnalogData, IBlindsData} from "../entities/data.interface";
import {GenericDataController} from "../controllers/generic.data-controller";
import {DeviceType, deviceTypeAsString} from '../entities/device-type';
import {PortsFactory} from '../hardware/ports-factory';
import {Port} from '../hardware/port-map';
import {IDevice, IAnalogDevice, ITemperatureDevice, IBlindsDevice} from '../entities/device.interface';
import {BlindsState} from '../entities/blinds-state';

let logger: Logger = getLogger('Engine');

// for engine internal use only
class DeviceInfo {
  constructor(public device: IDevice, public type: DeviceType) {
  }
}

class BlindsGPIOs {
  public state: BlindsState = BlindsState.OPEN;
  constructor(public keyUp: AbstractGPIO, public keyDown: AbstractGPIO, public actorUp: AbstractGPIO, public actorDown: AbstractGPIO) {
  }

  public reset(): void {
    this.keyUp.reset();
    this.keyDown.reset();
    this.actorUp.reset();
    this.actorDown.reset();
  }

  public update(blindsDEvice: IBlindsDevice): void {
    // TODO
  }
}


export class Engine {
  private static singleton: Engine = new Engine();
  private portsFactory: PortsFactory;
  private heartbeatLED: AbstractLED;
  private devices: Map<any, DeviceInfo> = new Map<any, DeviceInfo>();
  private ainInUse: Map<any, AbstractAIN> = new Map<any, AbstractAIN>();
  private gpiosInUse: Map<any, BlindsGPIOs> = new Map<any, BlindsGPIOs>();

  private constructor() {
    this.init();
  }

  public static getInstance(): Engine {
    return Engine.singleton;
  }

  private init(): void {
    this.portsFactory = PortsFactory.getInstance();
    this.initHeartbeatLED();
  }

  private initHeartbeatLED(): void {
    let led: AbstractLED = this.portsFactory.getLED(3);
    led.heartbeat();
  }

  public addBlindsDevice(device: IDevice) {
    let deviceInfo: DeviceInfo = new DeviceInfo(device, DeviceType.BLINDS);
    logger.info(`addBlindsDevice: ${JSON.stringify(device)}`);
    let blindsDevice: IBlindsDevice = device as IBlindsDevice;
    this.assignBlindsPorts(blindsDevice);
    this.devices.set(device.id, deviceInfo);
  }

  public addHumidityDevice(device: IDevice) {
    logger.info(`addHumidityDevice: ${JSON.stringify(device)}`);
    this.addAnalogDevice(device, DeviceType.HUMIDITY);
  }

  public addTemperatrueDevice(device: IDevice) {
    logger.info(`addTemperatureDevice: ${JSON.stringify(device)}`);
    this.addAnalogDevice(device, DeviceType.TEMPERATURE);
  }

  private addAnalogDevice(device: IDevice, deviceType: DeviceType) {
    let deviceInfo: DeviceInfo = new DeviceInfo(device, deviceType);
    logger.info(`addAnalogDevice: ${JSON.stringify(device)}`);

    let analogDevice: IAnalogDevice = device as ITemperatureDevice;
    let ain: AbstractAIN = this.assignAnalogInput(analogDevice.id, analogDevice.port);
    ain.poll(2).subscribe((val: number) => {
        let data: IAnalogData = {deviceId: device.id, timestamp: Date.now(), value: val};
        GenericDataController.getDataController(deviceType).addDataRecord(data);
      },
      (err: any) => logger.error(`${deviceTypeAsString(deviceType)} device polling error ${err}`),
      () => logger.info(`${deviceTypeAsString(deviceType)} device polling stopped`)
    );
    this.devices.set(device.id, deviceInfo);
  }

  public updateDevice(device: IDevice) {
    let deviceInfo: DeviceInfo = this.devices.get(device.id);
    if (deviceInfo) {
      logger.info(`updateDevice: ${deviceTypeAsString(deviceInfo.type)}\n\tfrom: ${JSON.stringify(deviceInfo)}\n\tto.:${JSON.stringify(device)}`);
      switch (deviceInfo.type) {
        case DeviceType.BLINDS:
          let newBlindsDevice: IBlindsDevice = device as IBlindsDevice;
          let oldBlindsDevice: IBlindsDevice = deviceInfo.device as IBlindsDevice;
          if (newBlindsDevice.keyUp != oldBlindsDevice.keyUp || newBlindsDevice.keyDown != oldBlindsDevice.keyDown ||
            newBlindsDevice.actorUp != oldBlindsDevice.actorUp || newBlindsDevice.actorDown != oldBlindsDevice.actorDown) {
            this.removeDevice(device.id);
            this.addBlindsDevice(device);
          }
          break;
        case DeviceType.HUMIDITY:
        case DeviceType.TEMPERATURE:
          let analogDevice: IAnalogDevice = device as IAnalogDevice;
          if (analogDevice.port != (deviceInfo.device as IAnalogDevice).port) {
            this.removeDevice(device.id);
            this.addAnalogDevice(device.id, deviceInfo.type);
          }
          break;
      }
      deviceInfo.device = device;
    } else {
      logger.error(`updateDevice: device ${device.name} with id ${device.id} not found`);
    }
  }

  public removeDevice(id: any) {
    let deviceInfo: DeviceInfo = this.devices.get(id);
    if (deviceInfo) {
      logger.info(`removeDevice: ${deviceTypeAsString(deviceInfo.type)} ${deviceInfo.device.name} ${deviceInfo.device.id}`);
      switch (deviceInfo.type) {
        case DeviceType.BLINDS:
          this.releaseBlindsPorts(id);
          break;
        case DeviceType.HUMIDITY:
        case DeviceType.TEMPERATURE:
          this.releaseAnalogInput(id);
          break;
      }
      this.devices.delete(id);
    } else {
      logger.error(`removeDevice: device with id ${id} not found`);
    }
  }

  private assignAnalogInput(id: any, port: Port): AbstractAIN {
    let ain: AbstractAIN = this.ainInUse.get(id);
    if (ain) {
      throw new Error(`Engine.assignAIN: device ${id} has port allready assigned`);
    }
    ain = this.portsFactory.getAIN(port);
    this.ainInUse.set(id, ain);
    return ain;
  }

  private releaseAnalogInput(id: any): void {
    let ain: AbstractAIN = this.ainInUse.get(id);
    if (ain) {
      ain.stopPolling();
      this.ainInUse.delete(id);
    } else {
      logger.error(`releaseAIN: device ${id} has no port assigned`);
    }
  }

  private assignBlindsPorts(blindsDevice: IBlindsDevice): BlindsGPIOs {
    let gpios: BlindsGPIOs = this.gpiosInUse.get(blindsDevice.id);
    if (gpios) {
      throw new Error(`Engine.assignBlindsPorts: device ${blindsDevice.id} ${blindsDevice.name} has port already assigned`);
    }
    let ports: BlindsGPIOs = new BlindsGPIOs(
      this.portsFactory.getDigitalInput(blindsDevice.keyUp),
      this.portsFactory.getDigitalInput(blindsDevice.keyDown),
      this.portsFactory.getDigitalOutput(blindsDevice.actorUp),
      this.portsFactory.getDigitalOutput(blindsDevice.actorDown),
    );
    this.gpiosInUse.set(blindsDevice.id, ports);

    ports.keyUp.watch().subscribe((keyPressed: boolean) => {
        let data: IBlindsData = {deviceId: blindsDevice.id, timestamp: Date.now(), state: this.getNewBlindsState(ports, BlindsState.OPENING)};
        GenericDataController.getDataController(DeviceType.BLINDS).addDataRecord(data);
      },
      (err: any) => logger.error(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp error ${err}`),
      () => logger.info(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp stopped`)
    );

    return ports;
  }

  private releaseBlindsPorts(id: any): void {
    let gpios: BlindsGPIOs = this.gpiosInUse.get(id);
    if (gpios) {
      gpios.reset();
      this.gpiosInUse.delete(id);
    } else {
      logger.error(`releaseBlindsPorts: device ${id} has no ports assigned`);
    }
  }

  private getNewBlindsState(blindsInfo: BlindsGPIOs, movingState: BlindsState): BlindsState {
    if (blindsInfo.state === BlindsState.OPEN && movingState === BlindsState.OPENING
      || blindsInfo.state === BlindsState.CLOSED && movingState === BlindsState.CLOSING) {
      // blinds are already in the requested end position
    } else {
      blindsInfo.state = movingState;
      // TODO start timer to set the end state if timer completes
    }
    return blindsInfo.state;
  }

}
