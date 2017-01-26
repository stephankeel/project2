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
    super(socketService.registerSocket("/humidity"),
      "humitity-Device", HumidityDeviceModel,
      c => new HumidityDeviceModel(c),
      (d, i) => HumidityDeviceController.updateDocument(d, i),
      d => new ResponseContainer<IHumidityDevice>(d),
      d => new ResponseCollectionContainer<IHumidityDevice>(d),
      id => new HumidityDataController().deleteAllById(id),
    );
  }

  private static updateDocument(documentFromDb: IHumidityDeviceDocument, inputDocument: IHumidityDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}

