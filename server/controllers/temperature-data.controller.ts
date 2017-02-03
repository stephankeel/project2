import {TemperatureDataModel, ITemperatureDataDocument} from '../models/temperature-data.model';
import {ITemperatureData} from '../entities/data.interface';
import {DeviceType} from '../entities/device-type';
import {GenericDataController} from './generic.data-controller';
import express = require('express');
import {SocketService} from '../socket/sockert-service';

export class TemperatureDataController extends GenericDataController<ITemperatureData, ITemperatureDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      '/temperature',
      DeviceType.TEMPERATURE,
      TemperatureDataModel,
      c => new TemperatureDataModel(c),
    );
  }
}

