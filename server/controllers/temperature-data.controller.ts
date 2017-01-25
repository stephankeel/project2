import {TemperatureDataModel, ITemperatureDataDocument} from "../models/temperature-data.model";
import {ResponseContainer, ResponseCollectionContainer} from "../wire/com-container";
import {ITemperatureData} from "../entities/data.interface";
import {GenericDataController} from "./generic.data-controller";
import express = require('express');

export class TemperatureDataController extends GenericDataController<ITemperatureData, ITemperatureDataDocument> {
  constructor() {
    super("temperature-data", TemperatureDataModel,
      c => new TemperatureDataModel(c),
      d => new ResponseContainer<ITemperatureData>(d),
      d => new ResponseCollectionContainer<ITemperatureData>(d),
    );
  }
}

