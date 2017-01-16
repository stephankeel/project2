'use strict';

export interface IDevice {
  id?: any;
  name?: string;
}

export interface IBlindsDevice extends IDevice {
  keyUp?: IInputPort;
  keyDown?: IInputPort;
  actorUp?: IOutputPort;
  actorDown?: IOutputPort;
  runningSeconds: number;

  isBlinds(device: any): void;
}

export interface ITemperaturDevice extends IDevice {
  port?: IInputPort;

  isTemperature(device: any): void;
}

export interface IHumidityDevice extends IDevice {
  port?: IInputPort;

  isHumidity(device: any): void;
}

interface IPort {
  id: number;
  name: string;
}

export interface IInputPort extends IPort {
}

export interface IOutputPort extends IPort {
}
