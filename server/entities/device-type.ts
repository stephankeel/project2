'use strict';

import {IDevice, IBlindsDevice, IHumidityDevice, ITemperaturDevice} from './device.interface';

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

export function deviceTypeOf(device: IDevice): DeviceType {
  if (isBlinds(device)) {
    return DeviceType.BLINDS;
  } else if (isHumidity(device)) {
    return DeviceType.HUMIDITY;
  } else if (isTemperature(device)) {
    return DeviceType.TEMPERATURE;
  } else {
    throw new Error(`unknown device ${device}`);
  }
}

function isBlinds(device: any): device is IBlindsDevice {
  return device.isBlinds() !== undefined;
}

function isHumidity(device: any): device is IHumidityDevice {
  return device.isHumidity() !== undefined;
}

function isTemperature(device: any): device is ITemperaturDevice {
  return device.isTemperature() !== undefined;
}
