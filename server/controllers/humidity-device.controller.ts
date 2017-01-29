'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IHumidityDeviceDocument, HumidityDeviceModel} from '../models/humidity-device.model';
import {IHumidityDevice} from '../entities/device.interface';
import {ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {GenericController} from './generic.controller';
import {HumidityDataController} from "./humidity-data.controller";
import {SocketService} from "../socket/sockert-service";


export class HumidityDeviceController extends GenericController<IHumidityDevice, IHumidityDeviceDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      socketService.registerSocket("/humidity"),
      HumidityDeviceModel,
      c => new HumidityDeviceModel(c),
      (d, i) => HumidityDeviceController.updateDocument(d, i),
      id => new HumidityDataController().deleteAllById(id),
    );
  }

  private static updateDocument(documentFromDb: IHumidityDeviceDocument, inputDocument: IHumidityDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}

