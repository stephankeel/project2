'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IBlindsDataDocument, BlindsDataModel} from '../models/blinds-data.model';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer, BroadcastContainer, ContentType} from '../wire/com-container';
import {IBlindsData} from "../entities/data.interface";

export function getBlindsData(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get blinds-data ${req.params.id}`);
  let ref = {_id: req.params.id};
  BlindsDataModel.findById((err: any, data: IBlindsDataDocument[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving blinds-data ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      data.forEach((rec) => rec.id = rec._id);
      logger.debug(`found ${data.length} blinds-data records`);
      let responseContentCollection: ResponseCollectionContainer<IBlindsData> = new ResponseCollectionContainer<IBlindsData>(data);
      res.json(responseContentCollection);
    }
  });
}

export function getLatestBlindsDataRecord(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get latest blinds-data record ${req.params.id}`);
  let ref = {_id: req.params.id};
  let sort = {timestamp: 1};
  BlindsDataModel.findOne(ref).sort(sort).exec((err: any, data: IBlindsDataDocument) => {
    if (err) {
      res.status(404).json({error: `error retrieving latest blinds-data record ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      data.id = data._id;
      logger.debug(`found latest blinds-data record ${req.params.id}: ${JSON.stringify(data)}`);
      let responseContent: ResponseContainer<IBlindsData> = new ResponseContainer<IBlindsData>(data);
      res.json(responseContent);
    }
  });
}

export function addBlindsData(data: IBlindsData) {
  let dataModel: IBlindsDataDocument = new BlindsDataModel(data);
  logger.info(`add blinds-data: ${JSON.stringify(data)}`);
  dataModel.save((err: any, addedData: IBlindsDataDocument) => {
    if (err) {
      logger.error(`error adding blinds-data ${JSON.stringify(data)}. ${err}`);
    } else {
      // set the id to the _id provided by the db
      dataModel.id = addedData._id;
      logger.debug(`added blinds-device successfully, id: ${addedData.id}`);

      // TODO: Broadcast data
      let broadcastData: BroadcastContainer<IBlindsData> = new BroadcastContainer(null, ContentType.BLINDS_DATA, dataModel);
      logger.error(`broadcasting added blinds-data ${JSON.stringify(broadcastData)} ==> TO BE IMPLEMENTED`);
    }
  });
};

export function cleanupBlindsData(id: string) {
  // TODO: implement
  logger.error(`cleanup blinds-data ${id} ==> TO BE IMPLEMENTED`);
}
