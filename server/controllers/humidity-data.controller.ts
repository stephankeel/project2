import express = require('express');
import {IHumidityDataDocument, HumidityDataModel} from '../models/humidity-data.model';
import {IHumidityData} from "../entities/data.interface";
import {ResponseContainer, ResponseCollectionContainer} from "../wire/com-container";
import {GenericDataController} from "./generic.data.controller";

export class HumidityDataController extends GenericDataController<IHumidityData, IHumidityDataDocument> {
  constructor() {
    super("humidity-data", HumidityDataModel,
      c => new HumidityDataModel(c),
      d => new ResponseContainer<IHumidityData>(d),
      d => new ResponseCollectionContainer<IHumidityData>(d),
    );
  }
}

