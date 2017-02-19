import {BlindsState} from './blinds-state';
import {IId} from './id.interface';

export interface IData extends IId {
  deviceId?: any,
  timestamp?: number;
}

export interface IBlindsData extends IData {
  state?: BlindsState;
  percentageDown?: number;
}

export interface IAnalogData extends IData {
  value?: number;
}

export interface IHumidityData extends IAnalogData {
}

export interface ITemperatureData extends IAnalogData {
}
