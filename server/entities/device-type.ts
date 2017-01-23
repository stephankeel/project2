'use strict';

import {IBlindsDevice, IHumidityDevice, ITemperatureDevice} from './device.interface';

export const enum DeviceType {
  BLINDS,
  HUMIDITY,
  TEMPERATURE
}

export const DeviceTypeValue: DeviceType[] = [DeviceType.BLINDS, DeviceType.HUMIDITY, DeviceType.TEMPERATURE];

export const DeviceTypeString: string[] = ['Blinds', 'Humidity', 'Temperature'];

export function deviceTypeAsString(type: DeviceType) {
  return DeviceTypeString[type];
}

