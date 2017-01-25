import express = require('express');
import {IBlindsDataDocument, BlindsDataModel} from '../models/blinds-data.model';
import {ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {IBlindsData} from "../entities/data.interface";
import {GenericDataController} from "./generic.data-controller";

export class BlindsDataController extends GenericDataController<IBlindsData, IBlindsDataDocument> {
  constructor() {
    super("humidity-data", BlindsDataModel,
      c => new BlindsDataModel(c),
      d => new ResponseContainer<IBlindsData>(d),
      d => new ResponseCollectionContainer<IBlindsData>(d),
    );
  }
}
