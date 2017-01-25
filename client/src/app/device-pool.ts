import {IBlindsDevice, IHumidityDevice, ITemperatureDevice} from '../../../server/entities/device.interface';
import {DeviceType, DeviceTypeString} from '../../../server/entities/device-type';
import {Port, analogInputs, digitalInputs, digitalOutputs} from '../../../server/hardware/port-map';

export {DeviceType} from '../../../server/entities/device-type';

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
  constructor(public type: DeviceType, public displayName: string, public css: string, public icon: string){
  }
}

export class BlindsDeviceCharacteristics extends DeviceCharacteristics {
  public readonly inputPortSet: Port[] = digitalInputs;
  public readonly outputPortSet: Port[] = digitalOutputs;

  constructor(){
    super(DeviceType.BLINDS, 'ROLLLADEN', 'blinds', 'blinds.svg');
  }
}

export class HumidityDeviceCharacteristics extends DeviceCharacteristics {
  public readonly portSet: Port[] = analogInputs;

  constructor(){
    super(DeviceType.HUMIDITY, 'FEUCHTIGKEIT', 'humidity', 'humidity.svg');
  }
}

export class TemperatureDeviceCharacteristics extends DeviceCharacteristics {
  public readonly portSet: Port[] = analogInputs;

  constructor(){
    super(DeviceType.TEMPERATURE, 'TEMPERATUR', 'temperature', 'temperature.svg');
  }
}

export const devicePool: DeviceCharacteristics[] = [new BlindsDeviceCharacteristics(), new HumidityDeviceCharacteristics(), new TemperatureDeviceCharacteristics];
