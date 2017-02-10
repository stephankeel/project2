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
  constructor(socketService: SocketService, engine: Engine) {
    super(socketService,
      "/humidity",
      HumidityDeviceModel,
      c => new HumidityDeviceModel(c),
      (d, i) => HumidityDeviceController.updateDocument(d, i),
      engine,
    );
    this.registerOnCreate((value: IHumidityDeviceDocument) => engine.addHumidityDevice(value));
    this.registerOnDelete((id: string) => new HumidityDataController(socketService).deleteAllById(id));
    this.init();
  }

  private static updateDocument(documentFromDb: IHumidityDeviceDocument, inputDocument: IHumidityDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }
}

