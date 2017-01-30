import express = require('express');
import {IBlindsDataDocument, BlindsDataModel} from '../models/blinds-data.model';
import {IBlindsData} from "../entities/data.interface";
import {GenericDataController} from "./generic.data-controller";
import {SocketService} from "../socket/sockert-service";

export class BlindsDataController extends GenericDataController<IBlindsData, IBlindsDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/blinds",
      BlindsDataModel,
      c => new BlindsDataModel(c),
    );
  }
}
