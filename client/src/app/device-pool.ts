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

export abstract class DeviceCharacteristics {
  constructor(public type: DeviceType, public displayName: string, public title: string, public css: string, public icon: string){
  }
}

export class BlindsDeviceCharacteristics extends DeviceCharacteristics {
  public static readonly inputPortSet: Port[] = digitalInputs;
  public static readonly outputPortSet: Port[] = digitalOutputs;

  constructor(){
    super(DeviceType.BLINDS, 'ROLLLADEN', 'Blinds', 'blinds', 'blinds.svg');
  }
}

export class HumidityDeviceCharacteristics extends DeviceCharacteristics {
  public static readonly portSet: Port[] = analogInputs;

  constructor(){
    super(DeviceType.HUMIDITY, 'FEUCHTIGKEIT', 'Humidity', 'humidity', 'humidity.svg');
  }
}

export class TemperatureDeviceCharacteristics extends DeviceCharacteristics {
  public static readonly portSet: Port[] = analogInputs;

  constructor(){
    super(DeviceType.TEMPERATURE, 'TEMPERATUR', 'Temperature', 'temperature', 'temperature.svg');
  }
}

export const devicePool: DeviceCharacteristics[] = [new BlindsDeviceCharacteristics(), new HumidityDeviceCharacteristics(), new TemperatureDeviceCharacteristics];
