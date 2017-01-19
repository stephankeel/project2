'use strict';

import {Port} from '../hardware/port-map';

interface IDevice {
  id?: any;
  name?: string;
}

export interface IBlindsDevice extends IDevice {
  keyUp?: Port;
  keyDown?: Port;
  actorUp?: Port;
  actorDown?: Port;
  runningSeconds?: number;
}

export interface ITemperaturDevice extends IDevice {
  port?: Port;
}

export interface IHumidityDevice extends IDevice {
  port?: Port;
}

