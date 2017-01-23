'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IHumidityDataDocument, HumidityDataModel} from '../models/humidity-data.model';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer, BroadcastContainer, ContentType} from '../wire/com-container';
import {IHumidityData} from "../entities/data.interface";

export function getHumidityData(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get humidity-data ${req.params.id}`);
  let ref = {_id: req.params.id};
  HumidityDataModel.findById((err: any, data: IHumidityDataDocument[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving humidity-data ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      data.forEach((rec) => rec.id = rec._id);
      logger.debug(`found ${data.length} humidity-data records`);
      let responseContentCollection: ResponseCollectionContainer<IHumidityData> = new ResponseCollectionContainer<IHumidityData>(data);
      res.json(responseContentCollection);
    }
  });
}

export function getLatestHumidityDataRecord(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get latest humidity-data record ${req.params.id}`);
  let ref = {_id: req.params.id};
  let sort = {timestamp: 1};
  HumidityDataModel.findOne(ref).sort(sort).exec((err: any, data: IHumidityDataDocument) => {
    if (err) {
      res.status(404).json({error: `error retrieving latest humidity-data record ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      data.id = data._id;
      logger.debug(`found latest humidity-data record ${req.params.id}: ${JSON.stringify(data)}`);
      let responseContent: ResponseContainer<IHumidityData> = new ResponseContainer<IHumidityData>(data);
      res.json(responseContent);
    }
  });
}

export function addHumidityData(data: IHumidityData) {
  let dataModel: IHumidityDataDocument = new HumidityDataModel(data);
  logger.info(`add humidity-data: ${JSON.stringify(data)}`);
  dataModel.save((err: any, addedData: IHumidityDataDocument) => {
    if (err) {
      logger.error(`error adding humidity-data ${JSON.stringify(data)}. ${err}`);
    } else {
      // set the id to the _id provided by the db
      dataModel.id = addedData._id;
      logger.debug(`added humidity-device successfully, id: ${addedData.id}`);

      // TODO: Broadcast data
      let broadcastData: BroadcastContainer<IHumidityData> = new BroadcastContainer(null, ContentType.HUMIDITY_DATA, dataModel);
      logger.error(`broadcasting added humidity-data ${JSON.stringify(broadcastData)} ==> TO BE IMPLEMENTED`);
    }
  });
};

export function cleanupHumidityData(id: string) {
  // TODO: implement
  logger.error(`cleanup humidity-data ${id} ==> TO BE IMPLEMENTED`);
}
