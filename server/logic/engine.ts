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
import {BlindsState, blindsStateAsString} from '../entities/blinds-state';

const LOGGER: Logger = getLogger('Engine');

export class Engine {
  private portsFactory: PortsFactory;
  private heartbeatLED: AbstractLED;
  private devices: Map<any, DeviceInfo> = new Map<any, DeviceInfo>();
  private ainInUse: Map<any, AbstractAIN> = new Map<any, AbstractAIN>();
  private gpiosInUse: Map<any, BlindsGPIOs> = new Map<any, BlindsGPIOs>();
  private blindsEngines: Map<any, BlindsEngine> = new Map<any, BlindsEngine>();

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
    let ports: BlindsGPIOs = this.assignBlindsPorts(blindsDevice);
    this.devices.set(device.id, deviceInfo);
    this.blindsEngines.set(device.id, new BlindsEngine(blindsDevice, ports));
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
    LOGGER.debug(`addAnalogDevice: ${JSON.stringify(device)}`);

    let analogDevice: IAnalogDevice = device as ITemperatureDevice;
    let ain: AbstractAIN = this.assignAnalogInput(analogDevice.id, analogDevice.port);
    ain.poll(analogDevice.pollingInterval).subscribe((val: number) => {
        let data: IAnalogData = {deviceId: device.id, timestamp: Date.now(), value: this.convertToDeviceUnits(deviceType, val)};
        GenericDataController.getDataController(deviceType).addDataRecord(data);
      },
      (err: any) => LOGGER.error(`${deviceTypeAsString(deviceType)} device polling error ${err}`),
      () => LOGGER.debug(`${deviceTypeAsString(deviceType)} device polling stopped`)
    );
    this.devices.set(device.id, deviceInfo);
  }

  /**
   * Converts the machine value to the range of device unit values
   * @param deviceType the type of device
   * @param value the machine value
   * @returns {number} the value in the units of the device
   */
  private convertToDeviceUnits(deviceType: DeviceType, value: number): number {
    if (this.portsFactory.isSimulation()) {
      return value;
    }
    switch(deviceType) {
      case DeviceType.HUMIDITY:
        return value * 100 / PortsFactory.MAX_ANALOG_VALUE;
      case DeviceType.TEMPERATURE:
        return (value - PortsFactory.MAX_ANALOG_VALUE/2) / 40;
      default:
        return value;
    }
  }

  public updateDevice(device: IDevice): void {
    let deviceInfo: DeviceInfo = this.devices.get(device.id);
    if (deviceInfo) {
      LOGGER.debug(`updateDevice: ${deviceTypeAsString(deviceInfo.type)}\n\tfrom: ${JSON.stringify(deviceInfo)}\n\tto.:${JSON.stringify(device)}`);
      switch (deviceInfo.type) {
        case DeviceType.BLINDS:
          let newBlindsDevice: IBlindsDevice = device as IBlindsDevice;
          let oldBlindsDevice: IBlindsDevice = deviceInfo.device as IBlindsDevice;
          if (newBlindsDevice.keyUp !== oldBlindsDevice.keyUp || newBlindsDevice.keyDown !== oldBlindsDevice.keyDown ||
            newBlindsDevice.actorUp !== oldBlindsDevice.actorUp || newBlindsDevice.actorDown !== oldBlindsDevice.actorDown ||
            newBlindsDevice.runningSeconds !== oldBlindsDevice.runningSeconds) {
            this.removeDevice(device.id);
            this.addBlindsDevice(device);
          }
          break;
        case DeviceType.HUMIDITY:
        case DeviceType.TEMPERATURE:
          let newAnalogDevice: IAnalogDevice = device as IAnalogDevice;
          let oldAnalogDevice: IAnalogDevice = deviceInfo.device as IAnalogDevice;
          if (newAnalogDevice.port !== oldAnalogDevice.port || newAnalogDevice.pollingInterval !== oldAnalogDevice.pollingInterval) {
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
          this.blindsEngines.delete(id);
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
      () => LOGGER.debug(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp stopped`)
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
      () => LOGGER.debug(`${deviceTypeAsString(DeviceType.BLINDS)} device watching keyUp stopped`)
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
  //        If the id is not set, then the command is applied to all blindsDevices
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
      // Command for single blinds
      let deviceInfo: DeviceInfo = this.devices.get(id);
      if (deviceInfo) {
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
      blindsDevices.forEach(device => LOGGER.debug(`\t${device.name}`));
    }
    return blindsDevices;
  }

  //---------------------------------------------------------------------------------------
  // End: Blinds command controller part
  //---------------------------------------------------------------------------------------

  private openBlinds(device: IBlindsDevice): void {
    this.blindsEngines.get(device.id).open();
  }

  private closeBlinds(device: IBlindsDevice): void {
    this.blindsEngines.get(device.id).close();
  }

  private stopBlinds(device: IBlindsDevice): void {
    this.blindsEngines.get(device.id).stop();
  }

}


//---------------------------------------------------------------------------------------
// Classes just internally used (by the engine)
//---------------------------------------------------------------------------------------

class DeviceInfo {
  constructor(public device: IDevice, public type: DeviceType) {
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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Start: Blinds logic part
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

class BlindsEngine {
  private state: BlindsState = BlindsState.ANYWHERE;
  private secondsTowardsClosed: number = 0;
  private timer: NodeJS.Timer;
  private timeIncrement: number = 1;

  constructor(private device: IBlindsDevice, private ports: BlindsGPIOs) {
    // Init: drive the blinds to the closed position
    this.close();
  }

  public open(): void {
    if (this.state !== BlindsState.OPEN && this.state !== BlindsState.OPENING) {
      this.process(BlindsState.OPENING);
    } else {
      LOGGER.debug(`openBlinds: ${this.device.name} already in state ${blindsStateAsString(this.state)}`)
    }
  }

  public close(): void {
    if (this.state !== BlindsState.CLOSED && this.state !== BlindsState.CLOSING) {
      this.process(BlindsState.CLOSING);
    } else {
      LOGGER.debug(`closeBlinds: ${this.device.name} already in state ${blindsStateAsString(this.state)}`)
    }
  }

  public stop(): void {
    if (this.state === BlindsState.OPENING || this.state === BlindsState.CLOSING) {
      this.process(BlindsState.ANYWHERE);
    } else {
      LOGGER.debug(`stopBlinds: ${this.device.name} already in state ${blindsStateAsString(this.state)}`)
    }
  }

  private process(state: BlindsState): void {
    if (this.timer) {
      LOGGER.debug(`stopTimer: ${this.device.name}`);
      clearInterval(this.timer);
    }
    this.state = state;
    this.setActors(state);

    switch (this.state) {
      case BlindsState.OPENING:
        this.timeIncrement = -1;
        break;
      case BlindsState.CLOSING:
        this.timeIncrement = 1;
        break;
      default:
        this.sendState();
        return;
    }

    this.timer = setInterval(() => {
      this.secondsTowardsClosed += this.timeIncrement;
      if (this.secondsTowardsClosed < 0) {
        LOGGER.debug(`stopTimer: ${this.device.name} --> blinds is open, secondsTowardsClosed: ${this.secondsTowardsClosed}`);
        this.state = BlindsState.OPEN;
        clearInterval(this.timer);
        this.setActors(this.state);
      } else if (this.secondsTowardsClosed > this.device.runningSeconds) {
        LOGGER.debug(`stopTimer: ${this.device.name} --> blinds is closed, secondsTowardsClosed: ${this.secondsTowardsClosed}`);
        this.state = BlindsState.CLOSED;
        clearInterval(this.timer);
        this.setActors(this.state);
      }
      this.sendState();
    }, 1000);
  }

  private sendState(): void {
    let data: IBlindsData = {
      deviceId: this.device.id,
      timestamp: Date.now(),
      state: this.state,
      percentageDown: this.getPercentage()
    };
    GenericDataController.getDataController(DeviceType.BLINDS).addDataRecord(data);
  }

  private getPercentage(): number {
    let percentage: number = 100 - 100 * (this.device.runningSeconds - this.secondsTowardsClosed) / this.device.runningSeconds;
    if (percentage > 100) {
      return 100;
    } else if (percentage < 0) {
      return 0;
    } else {
      return Math.round(percentage);
    }
  }

  /**
   * Set the state of the two actors of a blinds.
   */
  private setActors(state: BlindsState) {
    switch (state) {
      case BlindsState.OPENING:
        this.ports.actorDown.setState(false);
        this.ports.actorUp.setState(true);
        break;
      case BlindsState.CLOSING:
        this.ports.actorUp.setState(false);
        this.ports.actorDown.setState(true);
        break;
      default:
        this.ports.actorUp.setState(false);
        this.ports.actorDown.setState(false);
    }
  }
}

//---------------------------------------------------------------------------------------
// End: Blinds logic part
//---------------------------------------------------------------------------------------


