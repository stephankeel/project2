import {IBlindsDevice, IHumidityDevice, ITemperatureDevice} from '../../../server/entities/device.interface';
import {DeviceType, DeviceTypeString} from '../../../server/entities/device-type';
import {Port, analogInputs, digitalInputs, digitalOutputs} from '../../../server/hardware/port-map';

export {DeviceType} from '../../../server/entities/device-type';
export {Port, portName} from  '../../../server/hardware/port-map';

export class BlindsDevice implements IBlindsDevice {
  constructor(public id?: any,
              public name?: string,
              public keyUp?: Port,
              public keyDown?: Port,
              public actorUp?: Port,
              public actorDown?: Port,
              public runningSeconds?: number) {
  }
}

export class HumidityDevice implements IHumidityDevice {
  constructor(public id?: any,
              public name?: string,
              public port?: Port) {
  }
}

export class TemperatureDevice implements ITemperatureDevice {
  constructor(public id?: any,
              public name?: string,
              public port?: Port) {
  }
}

export abstract class DevicesInfo {
  count: number = 0;
  constructor(public type: DeviceType, public displayName: string, public title: string, public css: string, public icon: string){
  }
}

export class BlindsDevicesInfo extends DevicesInfo {
  public static readonly inputPortSet: Port[] = digitalInputs;
  public static readonly outputPortSet: Port[] = digitalOutputs;
  public static inputPortsInUse: Set<Port> = new Set<Port>();
  public static outputPortsInUse: Set<Port> = new Set<Port>();

  constructor(){
    super(DeviceType.BLINDS, 'ROLLLADEN', 'Blinds', 'blinds', 'blinds.svg');
  }
}

export abstract class AnalogDevicesInfo extends DevicesInfo {
  public static portsInUse: Set<Port> = new Set<Port>();
}

export class HumidityDevicesInfo extends AnalogDevicesInfo {
  public static readonly portSet: Port[] = analogInputs;
  public static portsInUse: Set<Port> = new Set<Port>();

  constructor(){
    super(DeviceType.HUMIDITY, 'FEUCHTIGKEIT', 'Humidity', 'humidity', 'humidity.svg');
  }
}

export class TemperatureDevicesInfo extends AnalogDevicesInfo {
  public static readonly portSet: Port[] = analogInputs;
  public static portsInUse: Set<Port> = new Set<Port>();

  constructor(){
    super(DeviceType.TEMPERATURE, 'TEMPERATUR', 'Temperature', 'temperature', 'temperature.svg');
  }
}

export const blindsDevicesInfo = new BlindsDevicesInfo();
export const humidityDevicesInfo = new HumidityDevicesInfo();
export const temperatureDevicesInfo = new TemperatureDevicesInfo();
export const devicePool: DevicesInfo[] = [blindsDevicesInfo, humidityDevicesInfo, temperatureDevicesInfo];
