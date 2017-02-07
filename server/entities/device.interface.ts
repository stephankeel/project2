import {Port} from '../hardware/port-map';
import {IId} from './id.interface';

export interface IDevice extends IId {
  name?: string;
}

export interface IBlindsDevice extends IDevice {
  keyUp?: Port;
  keyDown?: Port;
  actorUp?: Port;
  actorDown?: Port;
  runningSeconds?: number;
}

export interface IAnalogDevice extends IDevice {
  port?: Port;
}

export interface IHumidityDevice extends IAnalogDevice {
}

export interface ITemperatureDevice extends IAnalogDevice {
}
