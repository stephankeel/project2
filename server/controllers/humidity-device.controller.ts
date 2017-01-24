'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IHumidityDeviceDocument, HumidityDeviceModel} from '../models/humidity-device.model';
import {IHumidityDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {cleanupHumidityData} from './humidity-data.controller';
import {GenericController} from './generic.controller';


export class HumidityDeviceController extends GenericController<IHumidityDevice, IHumidityDeviceDocument> {
  constructor() {
    super("humitity-Device", HumidityDeviceModel,
      c => new HumidityDeviceModel(c),
      (d, i) => HumidityDeviceController.updateDocument(d, i),
      d => new ResponseContainer<IHumidityDevice>(d),
      d => new ResponseCollectionContainer<IHumidityDevice>(d),
      id => cleanupHumidityData(id),
    );
  }
  private static updateDocument(documentFromDb: IHumidityDeviceDocument, inputDocument: IHumidityDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}

