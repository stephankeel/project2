'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {ITemperatureDeviceDocument, TemperatureDeviceModel} from '../models/temperature-device.model';
import {ITemperatureDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {GenericController} from './generic.controller';
import {TemperatureDataController} from "./temperature-data.controller";
import {SocketService} from "../socket/sockert-service";

export class TemperatureDeviceController extends GenericController<ITemperatureDevice, ITemperatureDeviceDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      socketService.registerSocket("/temperature"),
      TemperatureDeviceModel,
      c => new TemperatureDeviceModel(c),
      (d, i) => TemperatureDeviceController.updateDocument(d, i),
      id => new TemperatureDataController().deleteAllById(id),
    );
  }

  private static updateDocument(documentFromDb: ITemperatureDeviceDocument, inputDocument: ITemperatureDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}
