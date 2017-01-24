import express = require('express');
import {IBlindsDeviceDocument, BlindsDeviceModel} from '../models/blinds-device.model';
import {IBlindsDevice} from '../entities/device.interface';
import {ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {BlindsDataController} from './blinds-data.controller';
import {GenericController} from './generic.controller';

export class BlindsDeviceController extends GenericController<IBlindsDevice, IBlindsDeviceDocument> {
  constructor() {
    super("blinds-device", BlindsDeviceModel,
      c => new BlindsDeviceModel(c),
      (d, i) => BlindsDeviceController.updateDocument(d, i),
      d => new ResponseContainer<IBlindsDevice>(d),
      d => new ResponseCollectionContainer<IBlindsDevice>(d),
      id => new BlindsDataController().deleteAllById(id),
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
}
