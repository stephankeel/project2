import {logger} from '../utils/logger';
import {AbstractAIN, AbstractLED, AbstractGPIO, Direction} from '../hardware/abstract-ports';
import {ITemperatureData} from "../entities/data.interface";
import {GenericDataController} from "../controllers/generic.data-controller";
import {DeviceType, deviceTypeAsString} from '../entities/device-type';
import {PortsFactory} from '../hardware/ports-factory';
import {IDevice, ITemperatureDevice} from '../entities/device.interface';

// for engine internal use only
class DeviceInfo {
  constructor(public device: IDevice, public type: DeviceType) {
  }
}

export class Engine {
  private static singleton: Engine = new Engine();
  private portsFactory: PortsFactory;
  private heartbeatLED: AbstractLED;
  private devices: Map<any, DeviceInfo> = new Map<any, DeviceInfo>();
  private ainInUse: Map<any, AbstractAIN> = new Map<any, AbstractAIN>();
  private gpioInUse: Map<any, AbstractGPIO[]> = new Map<any, AbstractGPIO[]>();

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
    this.devices.set(device.id, deviceInfo);
    logger.info(`Engine.addBlindsDevice: ${JSON.stringify(device)}`);


  }

  public addHumidityDevice(device: IDevice) {
    let deviceInfo: DeviceInfo = new DeviceInfo(device, DeviceType.HUMIDITY);
    this.devices.set(device.id, deviceInfo);
    logger.info(`Engine.addHumidityDevice: ${JSON.stringify(device)}`);


  }

  public addTemperatrueDevice(device: IDevice) {
    let deviceInfo: DeviceInfo = new DeviceInfo(device, DeviceType.TEMPERATURE);
    this.devices.set(device.id, deviceInfo);
    logger.info(`Engine.addTemperatureDevice: ${JSON.stringify(device)}`);

    let temperatureDevice: ITemperatureDevice = device as ITemperatureDevice;
    let ain: AbstractAIN = this.portsFactory.getAIN(temperatureDevice.port);
    this.ainInUse.set(temperatureDevice.id, ain);
    ain.poll(2).subscribe((val: number) => {
      let data: ITemperatureData = {deviceId: device.id, timestamp: Date.now(), value: val};
      GenericDataController.getDataController(DeviceType.TEMPERATURE).addDataRecord(data);
    }, (err: any) => logger.error(`temperature device polling error ${err}`), () => logger.info(`temperature device polling stopped`));
  }

  public updateDevice(device: IDevice) {
    let deviceInfo: DeviceInfo = this.devices.get(device.id);
    if (deviceInfo) {
      logger.error(`To be implement -> Engine.updateDevice: ${deviceTypeAsString(deviceInfo.type)}\n\tfrom: ${JSON.stringify(deviceInfo)}\n\tto.:${JSON.stringify(device)}`);
      //TODO: implement
    } else {
      logger.error(`Engine.updateDevice: device ${device.name} with id ${device.id} not found`);
    }
  }

  public removeDevice(id: any) {
    let deviceInfo: DeviceInfo = this.devices.get(id);
    if (deviceInfo) {
      logger.info(`Engine.remnoveDevice: ${deviceTypeAsString(deviceInfo.type)} ${deviceInfo.device.name} ${deviceInfo.device.id}`);
      switch (deviceInfo.type) {
        case DeviceType.BLINDS:
          let gpios: AbstractGPIO[] = this.gpioInUse.get(id);
          gpios.forEach( gpio => gpio.reset());
          this.gpioInUse.delete(id);
          break;
        case DeviceType.HUMIDITY:
        case DeviceType.TEMPERATURE:
          let ain: AbstractAIN = this.ainInUse.get(id);
          ain.stopPolling();
          this.ainInUse.delete(id);
          break;
      }
    } else {
      logger.error(`Engine.remnoveDevice: device with id ${id} not found`);
    }
  }

}
