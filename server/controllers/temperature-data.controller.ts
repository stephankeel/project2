'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {ITemperatureDataDocument, TemperatureDataModel} from '../models/temperature-data.model';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer, BroadcastContainer, ContentType} from '../wire/com-container';
import {ITemperatureData} from "../entities/data.interface";

export function getTemperatureData(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get temperature-data ${req.params.id}`);
  let ref = {_id: req.params.id};
  TemperatureDataModel.findById((err: any, data: ITemperatureDataDocument[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving temperature-data ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      data.forEach((rec) => rec.id = rec._id);
      logger.debug(`found ${data.length} temperature-data records`);
      let responseContentCollection: ResponseCollectionContainer<ITemperatureData> = new ResponseCollectionContainer<ITemperatureData>(data);
      res.json(responseContentCollection);
    }
  });
}

export function getLatestTemperatureDataRecord(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get latest temperature-data record ${req.params.id}`);
  let ref = {_id: req.params.id};
  let sort = {timestamp: 1};
  TemperatureDataModel.findOne(ref).sort(sort).exec((err: any, data: ITemperatureDataDocument) => {
    if (err) {
      res.status(404).json({error: `error retrieving latest temperature-data record ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      data.id = data._id;
      logger.debug(`found latest temperature-data record ${req.params.id}: ${JSON.stringify(data)}`);
      let responseContent: ResponseContainer<ITemperatureData> = new ResponseContainer<ITemperatureData>(data);
      res.json(responseContent);
    }
  });
}

export function addTemperatureData(data: ITemperatureData) {
  let dataModel: ITemperatureDataDocument = new TemperatureDataModel(data);
  logger.info(`add temperature-data: ${JSON.stringify(data)}`);
  dataModel.save((err: any, addedData: ITemperatureDataDocument) => {
    if (err) {
      logger.error(`error adding temperature-data ${JSON.stringify(data)}. ${err}`);
    } else {
      // set the id to the _id provided by the db
      dataModel.id = addedData._id;
      logger.debug(`added temperature-device successfully, id: ${addedData.id}`);

      // TODO: Broadcast data
      let broadcastData: BroadcastContainer<ITemperatureData> = new BroadcastContainer(null, ContentType.TEMPERATURE_DATA, dataModel);
      logger.error(`broadcasting added temperature-data ${JSON.stringify(broadcastData)} ==> TO BE IMPLEMENTED`);
    }
  });
};

export function cleanupTemperatureData(id: string) {
  // TODO: implement
  logger.error(`cleanup temperature-data ${id} ==> TO BE IMPLEMENTED`);
}

