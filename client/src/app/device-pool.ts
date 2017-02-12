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

class BlindsDevicesInfo extends DevicesInfo {
  public readonly inputPortSet: Port[] = digitalInputs;
  public readonly outputPortSet: Port[] = digitalOutputs;
  public inputPortsInUse: Set<Port> = new Set<Port>();
  public outputPortsInUse: Set<Port> = new Set<Port>();

  constructor(){
    super(DeviceType.BLINDS, 'ROLLLADEN', 'Blinds', 'blinds', 'blinds.svg');
  }

  updatePortsInUse(devices: BlindsDevice[]): void {
    blindsDevicesInfo.inputPortsInUse.clear();
    blindsDevicesInfo.outputPortsInUse.clear();
    devices.forEach(device => {
      blindsDevicesInfo.inputPortsInUse.add(device.keyUp);
      blindsDevicesInfo.inputPortsInUse.add(device.keyDown);
      blindsDevicesInfo.outputPortsInUse.add(device.actorUp);
      blindsDevicesInfo.outputPortsInUse.add(device.actorDown);
    });
  }
}

export abstract class AnalogDevicesInfo extends DevicesInfo {
  public static analogPortsInUse: Set<Port> = new Set<Port>();
  public readonly portSet: Port[] = analogInputs;
  public portsInUse: Set<Port> = new Set<Port>();

  static updateAnalogPortsInUse(devicesInfo: AnalogDevicesInfo, ports: Port[]) {
    devicesInfo.portSet.forEach(port => {
      // port added?
      if (ports.indexOf(port) > -1 && !devicesInfo.portsInUse.has(port)){
        AnalogDevicesInfo.analogPortsInUse.add(port);
      }
      // port removed?
      if (ports.indexOf(port) < 0 && devicesInfo.portsInUse.has(port)){
        AnalogDevicesInfo.analogPortsInUse.delete(port);
      }
    });
    devicesInfo.portsInUse.clear();
    ports.forEach(port => devicesInfo.portsInUse.add(port));
  }
}

class HumidityDevicesInfo extends AnalogDevicesInfo {
  constructor(){
    super(DeviceType.HUMIDITY, 'FEUCHTIGKEIT', 'Humidity', 'humidity', 'humidity.svg');
  }
}

class TemperatureDevicesInfo extends AnalogDevicesInfo {
  constructor(){
    super(DeviceType.TEMPERATURE, 'TEMPERATUR', 'Temperature', 'temperature', 'temperature.svg');
  }
}

export const blindsDevicesInfo = new BlindsDevicesInfo();
export const humidityDevicesInfo = new HumidityDevicesInfo();
export const temperatureDevicesInfo = new TemperatureDevicesInfo();
export const devicePool: DevicesInfo[] = [blindsDevicesInfo, humidityDevicesInfo, temperatureDevicesInfo];
