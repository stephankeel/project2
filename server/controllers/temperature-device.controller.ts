import express = require('express');
import {ITemperatureDeviceDocument, TemperatureDeviceModel} from "../models/temperature-device.model";
import {ITemperatureDevice} from "../entities/device.interface";
import {TemperatureDataController} from "./temperature-data.controller";
import {SocketService} from "../socket/socket-service";
import {Engine} from "../logic/engine";
import {GenericDeviceController} from "./generic-device.controller";

export class TemperatureDeviceController extends GenericDeviceController<ITemperatureDevice, ITemperatureDeviceDocument> {
  constructor(socketService: SocketService, engine: Engine) {
    super(socketService,
      "/temperature",
      TemperatureDeviceModel,
      c => new TemperatureDeviceModel(c),
      (d, i) => TemperatureDeviceController.updateDocument(d, i),
      id => new TemperatureDataController(socketService).deleteAllById(id),
      engine,
    );
    this.registerOnCreate((value: ITemperatureDeviceDocument) => engine.addTemperatrueDevice(value));
    this.init();
  }

  private static updateDocument(documentFromDb: ITemperatureDeviceDocument, inputDocument: ITemperatureDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }

}
