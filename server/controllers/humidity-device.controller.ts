import express = require('express');
import {IHumidityDeviceDocument, HumidityDeviceModel} from '../models/humidity-device.model';
import {IHumidityDevice} from '../entities/device.interface';
import {SocketService} from '../socket/socket-service';
import {GenericDeviceController} from './generic-device.controller';

export class HumidityDeviceController extends GenericDeviceController<IHumidityDevice, IHumidityDeviceDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      '/humidity',
      HumidityDeviceModel,
      c => new HumidityDeviceModel(c),
      (d, i) => HumidityDeviceController.updateDocument(d, i)
    );
  }

  private static updateDocument(documentFromDb: IHumidityDeviceDocument, inputDocument: IHumidityDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}

