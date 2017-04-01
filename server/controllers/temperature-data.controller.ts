import {TemperatureDataModel, ITemperatureDataDocument} from '../models/temperature-data.model';
import {IAnalogData} from '../entities/data.interface';
import {DeviceType} from '../entities/device-type';
import {GenericDataController} from './generic.data-controller';
import express = require('express');
import {SocketService} from '../socket/socket-service';

export class TemperatureDataController extends GenericDataController<IAnalogData, ITemperatureDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      '/temperature',
      DeviceType.TEMPERATURE,
      TemperatureDataModel,
      c => new TemperatureDataModel(c),
    );
  }
}

