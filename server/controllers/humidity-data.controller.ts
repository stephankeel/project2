import express = require('express');
import {IHumidityDataDocument, HumidityDataModel} from '../models/humidity-data.model';
import {IHumidityData} from "../entities/data.interface";
import {ResponseContainer, ResponseCollectionContainer} from "../wire/com-container";
import {GenericDataController} from "./generic.data-controller";
import {SocketService} from "../socket/sockert-service";

export class HumidityDataController extends GenericDataController<IHumidityData, IHumidityDataDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/humidity",
      HumidityDataModel,
      c => new HumidityDataModel(c),
    );
  }
}

