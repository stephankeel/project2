import express = require('express');
import {IHumidityDeviceDocument, HumidityDeviceModel} from '../models/humidity-device.model';
import {IHumidityDevice} from '../entities/device.interface';
import {GenericController} from './generic.controller';
import {HumidityDataController} from "./humidity-data.controller";
import {SocketService} from "../socket/socket-service";
import {Engine} from '../logic/engine';
import {GenericSubject} from "./generic-subject";
import {GenericDeviceController} from "./generic-device.controller";

export class HumidityDeviceController extends GenericDeviceController<IHumidityDevice, IHumidityDeviceDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/humidity",
      HumidityDeviceModel,
      c => new HumidityDeviceModel(c),
      (d, i) => HumidityDeviceController.updateDocument(d, i),
      id => new HumidityDataController(socketService).deleteAllById(id),
    );
  }

  private static updateDocument(documentFromDb: IHumidityDeviceDocument, inputDocument: IHumidityDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }

  protected informOnAdd(device: IHumidityDeviceDocument): void {
    Engine.getInstance().addHumidityDevice(device);
  }

}

