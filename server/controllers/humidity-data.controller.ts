import express = require('express');
import {IHumidityDataDocument, HumidityDataModel} from '../models/humidity-data.model';
import {IAnalogData} from '../entities/data.interface';
import {DeviceType} from '../entities/device-type';
import {GenericDataController} from './generic.data-controller';
import {SocketService} from '../socket/socket-service';

export class HumidityDataController extends GenericDataController<IAnalogData, IHumidityDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/humidity",
      DeviceType.HUMIDITY,
      HumidityDataModel,
      c => new HumidityDataModel(c),
    );
  }
}

