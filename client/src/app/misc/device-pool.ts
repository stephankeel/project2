import {IBlindsDevice, IHumidityDevice, ITemperatureDevice} from '../../../../server/entities/device.interface';
import {DeviceType} from '../../../../server/entities/device-type';
import {Port} from '../../../../server/hardware/port-map';

export {DeviceType} from '../../../../server/entities/device-type';
export {Port, portName} from  '../../../../server/hardware/port-map';

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
              public port?: Port,
              public pollingInterval?: number) {
  }
}

export class TemperatureDevice implements ITemperatureDevice {
  constructor(public id?: any,
              public name?: string,
              public port?: Port,
              public pollingInterval?: number) {
  }
}

export abstract class DevicesInfo {
  count = 0;

  constructor(public type: DeviceType, public displayName: string, public title: string, public css: string, public icon: string) {
  }
}

class BlindsDevicesInfo extends DevicesInfo {
  constructor() {
    super(DeviceType.BLINDS, 'ROLLLADEN', 'Blinds', 'blinds', 'blinds.svg');
  }
}

class HumidityDevicesInfo extends DevicesInfo {
  constructor() {
    super(DeviceType.HUMIDITY, 'FEUCHTIGKEIT', 'Humidity', 'humidity', 'humidity.svg');
  }
}

class TemperatureDevicesInfo extends DevicesInfo {
  constructor() {
    super(DeviceType.TEMPERATURE, 'TEMPERATUR', 'Temperature', 'temperature', 'temperature.svg');
  }
}

export const blindsDevicesInfo = new BlindsDevicesInfo();
export const humidityDevicesInfo = new HumidityDevicesInfo();
export const temperatureDevicesInfo = new TemperatureDevicesInfo();
export const devicePool: DevicesInfo[] = [blindsDevicesInfo, humidityDevicesInfo, temperatureDevicesInfo];
