import express = require('express');
import {IBlindsDeviceDocument, BlindsDeviceModel} from '../models/blinds-device.model';
import {IBlindsDevice} from '../entities/device.interface';
import {BlindsDataController} from './blinds-data.controller';
import {GenericController} from './generic.controller';
import {SocketService} from "../socket/socket-service";
import {Engine} from '../logic/engine';
import {GenericDeviceController} from "./generic-device.controller";

export class BlindsDeviceController extends GenericDeviceController<IBlindsDevice, IBlindsDeviceDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/blinds",
      BlindsDeviceModel,
      c => new BlindsDeviceModel(c),
      (d, i) => BlindsDeviceController.updateDocument(d, i),
      id => new BlindsDataController(socketService).deleteAllById(id),
    );
  }

  private static updateDocument(documentFromDb: IBlindsDeviceDocument, inputDocument: IBlindsDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.keyUp = inputDocument.keyUp;
    documentFromDb.keyDown = inputDocument.keyDown;
    documentFromDb.actorUp = inputDocument.actorUp;
    documentFromDb.actorDown = inputDocument.actorDown;
    documentFromDb.runningSeconds = inputDocument.runningSeconds;
  }

  protected informOnAdd(device: IBlindsDeviceDocument): void {
    Engine.getInstance().addBlindsDevice(device);
  }

}
