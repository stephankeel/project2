'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {ITemperatureDeviceDocument, TemperatureDeviceModel} from '../models/temperature-device.model';
import {ITemperatureDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {GenericController} from './generic.controller';
import {TemperatureDataController} from "./temperature-data.controller";

export class TemperatureDeviceController extends GenericController<ITemperatureDevice, ITemperatureDeviceDocument> {
  constructor() {
    super("temperature-device", TemperatureDeviceModel,
      c => new TemperatureDeviceModel(c),
      (d, i) => TemperatureDeviceController.updateDocument(d, i),
      d => new ResponseContainer<ITemperatureDevice>(d),
      d => new ResponseCollectionContainer<ITemperatureDevice>(d),
      id => new TemperatureDataController().deleteAllById(id),
    );
  }
  private static updateDocument(documentFromDb: ITemperatureDeviceDocument, inputDocument: ITemperatureDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}
