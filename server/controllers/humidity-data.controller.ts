import express = require('express');
import {IHumidityDataDocument, HumidityDataModel} from '../models/humidity-data.model';
import {IHumidityData} from '../entities/data.interface';
import {DeviceType} from '../entities/device-type';
import {GenericDataController} from './generic.data-controller';
import {SocketService} from '../socket/sockert-service';

export class HumidityDataController extends GenericDataController<IHumidityData, IHumidityDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/humidity",
      DeviceType.HUMIDITY,
      HumidityDataModel,
      c => new HumidityDataModel(c),
    );
  }
}

