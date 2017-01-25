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

export interface IHumidityDevice extends IDevice {
  port?: Port;
}

export interface ITemperatureDevice extends IDevice {
  port?: Port;
}
