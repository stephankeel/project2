import {BlindsState} from './blinds-state';
import {IId} from './id.interface';

export interface IData extends IId {
  deviceId?: any,
  timestamp?: number;
}

export interface IBlindsData extends IData {
  state?: BlindsState;
}

export interface IHumidityData extends IData {
  value?: number;
}

export interface ITemperatureData extends IData {
  value?: number;
}
