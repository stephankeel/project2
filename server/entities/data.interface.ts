'use strict';

import {BlindsState} from './blinds-state';

interface IData {
  id?: any;
  deviceId?: string,
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
