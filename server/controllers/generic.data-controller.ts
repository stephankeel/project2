import {logger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import {ResponseContainer, ResponseCollectionContainer} from "../wire/com-container";
import express = require('express');
import {Model} from "mongoose";
import {IDataController} from "./data-controller.interface";

export class GenericDataController<T, R extends IDeviceDocument> implements IDataController<T> {
  constructor(private loggingPrefix: string,
              private model: Model<R>,
              private createDocument: (content: T) => R,
              private createResponseContainer: (content: R) => ResponseContainer<T>,
              private createResponseCollectionContainer: (content: R[]) => ResponseCollectionContainer<T>) {
  }

  public getAllById(req: express.Request, res: express.Response) {
    logger.debug(`getAllById ${this.loggingPrefix} ${req.params.id}`);
    // TODO: check if deviceId is correct (changed from _id) DL
    let ref = {deviceId: req.params.id};
    this.model.findById(ref, (err: any, data: R[]) => {
      if (err) {
        res.status(404).json({error: `error retrieving all ${this.loggingPrefix} with deviceId ${ref.deviceId}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        // TODO: should we create new Objects here, to prevent two properties (id and _id)?
        data.forEach((rec) => rec.id = rec._id);
        logger.debug(`found ${data.length} ${this.loggingPrefix} records`);
        let responseContentCollection: ResponseCollectionContainer<T> = this.createResponseCollectionContainer(data);
        res.json(responseContentCollection);
      }
    });
  }

  public getLatestById(req: express.Request, res: express.Response) {
    logger.debug(`get latest ${this.loggingPrefix} record ${req.params.id}`);
    // TODO: check if deviceId is correct (changed from _id) DL
    let ref = {deviceId: req.params.id};
    let sort = {timestamp: 1};
    this.model.findOne(ref).sort(sort).exec((err: any, data: R) => {
      if (err) {
        res.status(404).json({error: `error retrieving latest ${this.loggingPrefix} record ${ref.deviceId}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        data.id = data._id;
        logger.debug(`found latest ${this.loggingPrefix} record ${req.params.id}: ${JSON.stringify(data)}`);
        let responseContent: ResponseContainer<T> = this.createResponseContainer(data);
        res.json(responseContent);
      }
    });
  }

  public addDataRecord(data: T) {
    let dataModel: R = this.createDocument(data);
    logger.info(`add ${this.loggingPrefix}: ${JSON.stringify(data)}`);
    dataModel.save((err: any, addedData: R) => {
      if (err) {
        logger.error(`error adding ${this.loggingPrefix} ${JSON.stringify(data)}. ${err}`);
      } else {
        // set the id to the _id provided by the db
        dataModel.id = addedData._id;
        logger.debug(`added ${this.loggingPrefix} successfully, id: ${addedData.id}`);

        // TODO: Broadcast data
        // let broadcastData: BroadcastContainer<ITemperatureData> = new BroadcastContainer(null, ContentType.TEMPERATURE_DATA, dataModel);
        // logger.error(`broadcasting added ${this.loggingPrefix} ${JSON.stringify(broadcastData)} ==> TO BE IMPLEMENTED`);
      }
    });
  };

  public deleteAllById(id: string) {
    // TODO: untested code
    logger.debug(`delete all ${this.loggingPrefix} ${id}`);
    let ref = {deviceId: id};
    this.model.findById(ref, (err: any, data: R[]) => {
      if (err) {
        return;
      } else {
        // delete all entries with given deviceId
        data.forEach((rec) => {
          logger.info(`delete ${this.loggingPrefix} ${rec._id}`);
          let ref = {_id: rec._id};
          this.model.remove(ref);
        });
      }
    });
    logger.debug(`deleted all ${this.loggingPrefix} entries with deviceId ${id} successfully`);
  }
}

