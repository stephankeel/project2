import {TemperatureDataModel, ITemperatureDataDocument} from "../models/temperature-data.model";
import {ResponseContainer, ResponseCollectionContainer} from "../wire/com-container";
import {ITemperatureData} from "../entities/data.interface";
import {GenericDataController} from "./generic.data-controller";
import express = require('express');
import {SocketService} from "../socket/sockert-service";

export class TemperatureDataController extends GenericDataController<ITemperatureData, ITemperatureDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/temperature",
      TemperatureDataModel,
      c => new TemperatureDataModel(c),
    );
  }
}

