import {getLogger, Logger} from '../utils/logger';
import {AbstractAIN, AbstractLED, AbstractGPIO, Direction} from '../hardware/abstract-ports';
import {IAnalogData, IBlindsData} from "../entities/data.interface";
import {BlindsDeviceController} from "../controllers/blinds-device.controller";
import {HumidityDeviceController} from "../controllers/humidity-device.controller";
import {TemperatureDeviceController} from "../controllers/temperature-device.controller";
import {GenericDataController} from "../controllers/generic.data-controller";
import {DeviceType, deviceTypeAsString} from '../entities/device-type';
import {PortsFactory} from '../hardware/ports-factory';
import {Port} from '../hardware/port-map';
import {IDevice, IAnalogDevice, ITemperatureDevice, IBlindsDevice} from '../entities/device.interface';
import {BlindsState} from '../entities/blinds-state';

const LOGGER: Logger = getLogger('Engine');

export class Engine {
  private portsFactory: PortsFactory;
  private heartbeatLED: AbstractLED;
  private devices: Map<any, DeviceInfo> = new Map<any, DeviceInfo>();
  private ainInUse: Map<any, AbstractAIN> = new Map<any, AbstractAIN>();
  private gpiosInUse: Map<any, BlindsGPIOs> = new Map<any, BlindsGPIOs>();
  private currentBlindsState: Map<any, CurrentBlindsState> = new Map<any, CurrentBlindsState>();

  public constructor() {
    this.init();
  }

  private init(): void {
    this.portsFactory = PortsFactory.getInstance();
    this.initHeartbeatLED();
  }

  private initHeartbeatLED(): void {
    let led: AbstractLED = this.portsFactory.getLED(3);
    led.heartbeat();
  }

  public registerBlindsDeviceController(deviceController: BlindsDeviceController): void {
    deviceController.registerOnCreate((device: IDevice) => this.addBlindsDevice(device));
    deviceController.registerOnUpdate((device: IDevice) => this.updateDevice(device));
    deviceController.registerOnDelete((id: any) => this.removeDevice(id));
  }

  public registerHumidityDeviceController(deviceController: HumidityDeviceController): void {
    deviceController.registerOnCreate((device: IDevice) => this.addHumidityDevice(device));
    deviceController.registerOnUpdate((device: IDevice) => this.updateDevice(device));
    deviceController.registerOnDelete((id: any) => this.removeDevice(id));
  }

  public registerTemperatureDeviceController(deviceController: TemperatureDeviceController): void {
    deviceController.registerOnCreate((device: IDevice) => this.addTemperatrueDevice(device));
    deviceController.registerOnUpdate((device: IDevice) => this.updateDevice(device));
    deviceController.registerOnDelete((id: any) => this.removeDevice(id));
  }

  private addBlindsDevice(device: IDevice): void {
    let deviceInfo: DeviceInfo = new DeviceInfo(device, DeviceType.BLINDS);
    LOGGER.info(`addBlindsDevice: ${JSON.stringify(device)}`);
    let blindsDevice: IBlindsDevice = device as IBlindsDevice;
    this.assignBlindsPorts(blindsDevice);
    this.devices.set(device.id, deviceInfo);
    this.currentBlindsState.set(device.id, new CurrentBlindsState());
  }

  private addHumidityDevice(device: IDevice): void {
    LOGGER.info(`addHumidityDevice: ${JSON.stringify(device)}`);
    this.addAnalogDevice(device, DeviceType.HUMIDITY);
  }

  private addTemperatrueDevice(device: IDevice): void {
    LOGGER.info(`addTemperatureDevice: ${JSON.stringify(device)}`);
    this.addAnalogDevice(device, DeviceType.TEMPERATURE);
  }

  private addAnalogDevice(device: IDevice, deviceType: DeviceType): void {
    let deviceInfo: DeviceInfo = new DeviceInfo(device, deviceType);
    LOGGER.info(`addAnalogDevice: ${JSON.stringify(device)}`);

    let analogDevice: IAnalogDevice = device as ITemperatureDevice;
    let ain: AbstractAIN = this.assignAnalogInput(analogDevice.id, analogDevice.port);
    ain.poll(2).subscribe((val: number) => {
        let data: IAnalogData = {deviceId: device.id, timestamp: Date.now(), value: val};
        GenericDataController.getDataController(deviceType).addDataRecord(data);
      },
      (err: any) => LOGGER.error(`${deviceTypeAsString(deviceType)} device polling error ${err}`),
      () => LOGGER.info(`${deviceTypeAsString(deviceType)} device polling stopped`)
    );
    this.devices.set(device.id, deviceInfo);
  }

  public updateDevice(device: IDevice): void {
    let deviceInfo: DeviceInfo = this.devices.get(device.id);
    if (deviceInfo) {
      LOGGER.info(`updateDevice: ${deviceTypeAsString(deviceInfo.type)}\n\tfrom: ${JSON.stringify(deviceInfo)}\n\tto.:${JSON.stringify(device)}`);
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
            this.addAnalogDevice(device, deviceInfo.type);
          }
          break;
      }
      deviceInfo.device = device;
    } else {
      LOGGER.error(`updateDevice: device ${device.name} with id ${device.id} not found`);
    }
  }

  public removeDevice(id: any): void {
    let deviceInfo: DeviceInfo = this.devices.get(id);
    if (deviceInfo) {
      LOGGER.info(`removeDevice: ${deviceTypeAsString(deviceInfo.type)} ${deviceInfo.device.name} ${deviceInfo.device.id}`);
      switch (deviceInfo.type) {
        case DeviceType.BLINDS:
          this.releaseBlindsPorts(id);
          this.currentBlindsState.delete(id);
          break;
        case DeviceType.HUMIDITY:
        case DeviceType.TEMPERATURE:
          this.releaseAnalogInput(id);
          break;
      }
      this.devices.delete(id);
    } else {
      LOGGER.error(`removeDevice: device with id ${id} not found`);
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
      LOGGER.error(`releaseAIN: device ${id} has no port assigned`);
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
        LOGGER.debug(`keyUp detected ${blindsDevice.name} -> state: ${keyPressed ? 'pressed' : 'released'}`);
        if (keyPressed) {
          this.openBlinds(blindsDevice);
        } else {
          this.stopBlinds(blindsDevice);
        }
      },
      (err: any) => LOGGER.error(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp error ${err}`),
      () => LOGGER.info(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp stopped`)
    );

    ports.keyDown.watch().subscribe((keyPressed: boolean) => {
        LOGGER.debug(`keyDown detected ${blindsDevice.name} -> state: ${keyPressed ? 'pressed' : 'released'}`);
        if (keyPressed) {
          this.closeBlinds(blindsDevice);
        } else {
          this.stopBlinds(blindsDevice);
        }
      },
      (err: any) => LOGGER.error(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp error ${err}`),
      () => LOGGER.info(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp stopped`)
    );

    return ports;
  }

  private releaseBlindsPorts(id: any): void {
    let gpios: BlindsGPIOs = this.gpiosInUse.get(id);
    if (gpios) {
      gpios.reset();
      this.gpiosInUse.delete(id);
    } else {
      LOGGER.error(`releaseBlindsPorts: device ${id} has no ports assigned`);
    }
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Start: Blinds command controller part
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  public openBlindsCommand(id?: any): void {
    this.getBlindsDevices(id).forEach(device => this.openBlinds(device));
  }

  public closeBlindsCommand(id?: any): void {
    this.getBlindsDevices(id).forEach(device => this.closeBlinds(device));
  }

  public stopBlindsCommand(id?: any): void {
    this.getBlindsDevices(id).forEach(device => this.stopBlinds(device));
  }

  private getBlindsDevices(id?: any): IBlindsDevice[] {
    let blindsDevices: IBlindsDevice[] = [];
    if (id) {
      // Command for single blind
      let deviceInfo: DeviceInfo = this.devices.get(id);
      if (deviceInfo) {
        LOGGER.info(`getBlindsDevice: ${deviceTypeAsString(deviceInfo.type)} ${deviceInfo.device.name} ${deviceInfo.device.id}`);
        if (deviceInfo.type === DeviceType.BLINDS) {
          blindsDevices.push(deviceInfo.device)
        }
      } else {
        LOGGER.error(`getBlindsDevices: device with id ${id} not found`);
      }
    } else {
      // Command for all blinds
      this.devices.forEach((deviceInfo: DeviceInfo, id: any, map: Map<any, DeviceInfo>) => {
        if (deviceInfo.type === DeviceType.BLINDS) {
          blindsDevices.push(deviceInfo.device);
        }
      });
    }
    if (LOGGER.isDebugEnabled()) {
      LOGGER.debug(`getBlindsDevices of id: ${id}`);
      blindsDevices.forEach(device => LOGGER.debug(`/t${device.name}`));
    }
    return blindsDevices;
  }

  //---------------------------------------------------------------------------------------
  // End: Blinds command controller part
  //---------------------------------------------------------------------------------------

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Start: Blinds logic part
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  private openBlinds(device: IBlindsDevice): void {
    LOGGER.error(`openBlinds: ${device.name}`);
    let data: IBlindsData = {
      deviceId: device.id,
      timestamp: Date.now(),
      state: this.getNewBlindsState(this.currentBlindsState.get(device.id), BlindsState.OPENING)
    };
    this.setActors(device, 1);
    GenericDataController.getDataController(DeviceType.BLINDS).addDataRecord(data);
  }

  private closeBlinds(device: IBlindsDevice): void {
    LOGGER.error(`closeBlinds: ${device.name}`);
    let data: IBlindsData = {
      deviceId: device.id,
      timestamp: Date.now(),
      state: this.getNewBlindsState(this.currentBlindsState.get(device.id), BlindsState.CLOSING)
    };
    this.setActors(device, -1);
    GenericDataController.getDataController(DeviceType.BLINDS).addDataRecord(data);
  }

  private stopBlinds(device: IBlindsDevice): void {
    LOGGER.error(`stopBlinds: ${device.name}`);
    let data: IBlindsData = {
      deviceId: device.id,
      timestamp: Date.now(),
      state: this.getNewBlindsState(this.currentBlindsState.get(device.id), BlindsState.ANYWHERE)
    };
    this.setActors(device, 0);
    GenericDataController.getDataController(DeviceType.BLINDS).addDataRecord(data);
  }

  private getNewBlindsState(currentState: CurrentBlindsState, movingState: BlindsState): BlindsState {
    if (currentState.state === BlindsState.OPEN && movingState === BlindsState.OPENING
      || currentState.state === BlindsState.CLOSED && movingState === BlindsState.CLOSING) {
      // blinds are already in the requested end position
    } else {
      currentState.state = movingState;
      // TODO start timer to set the end state if timer completes
    }
    return currentState.state;
  }

  private setActors(device: IBlindsDevice, state: number) {
    let gpios: BlindsGPIOs = this.gpiosInUse.get(device.id);
    gpios.actorUp.setState(state > 0);
    gpios.actorDown.setState(state < 0);
  }

  //---------------------------------------------------------------------------------------
  // End: Blinds logic part
  //---------------------------------------------------------------------------------------

}

//---------------------------------------------------------------------------------------
// Classes just internally used (by the engine)
//---------------------------------------------------------------------------------------

class DeviceInfo {
  constructor(public device: IDevice, public type: DeviceType) {
  }
}

class CurrentBlindsState {
  constructor(public state: BlindsState = BlindsState.OPEN) {
  }
}

class BlindsGPIOs {
  constructor(public keyUp: AbstractGPIO, public keyDown: AbstractGPIO, public actorUp: AbstractGPIO, public actorDown: AbstractGPIO) {
  }

  public reset(): void {
    this.keyUp.reset();
    this.keyDown.reset();
    this.actorUp.reset();
    this.actorDown.reset();
  }
}


