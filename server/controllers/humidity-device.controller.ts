'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IHumidityDeviceDocument, HumidityDeviceModel} from '../models/humidity-device.model';
import {IHumidityDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {cleanupHumidityData} from './humidity-data.controller';

export function addHumidityDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let requestContent: RequestContainer<IHumidityDevice> = req.body;
  let device: IHumidityDeviceDocument = new HumidityDeviceModel(requestContent.content);
  logger.info(`create humidity-device: ${JSON.stringify(requestContent)}`);
  device.save((err: any, addedDevice: IHumidityDeviceDocument) => {
    if (err) {
      res.status(500).json({error: `error creating humidity-device ${device.name}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = addedDevice._id;
      logger.debug(`created humidity-device successfully, id: ${addedDevice.id}`);
      let responseContent: ResponseContainer<IHumidityDevice> = new ResponseContainer<IHumidityDevice>(device);
      res.status(201).json(responseContent);
    }
  });
};

export function updateHumidityDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let id = req.params.id;
  logger.info(`update humidity-device [${id}]: ${JSON.stringify(req.body)}`);
  HumidityDeviceModel.findById(id, (err: any, deviceFromDb: IHumidityDeviceDocument) => {
    if (err) {
      res.status(404).json({error: `humidity-device ${id} not found. ${err}`});
    } else {
      let requestContent: RequestContainer<IHumidityDevice> = req.body;
      let device: IHumidityDeviceDocument = new HumidityDeviceModel(requestContent.content);
      // copy the properties
      deviceFromDb.name = device.name;
      deviceFromDb.port = device.port;
      // save the updated user
      deviceFromDb.save((err: any, updatedDevice: IHumidityDeviceDocument) => {
        if (err) {
          res.status(500).json({error: `error updating humidity-device ${id}. ${err}`});
        } else {
          logger.debug('updated humidity-device successfully');
          let responseContent: ResponseContainer<IHumidityDevice> = new ResponseContainer<IHumidityDevice>(updatedDevice);
          res.json(responseContent);
        }
      });
    }
  });
}

export function getAllHumidityDevices(req: express.Request, res: express.Response, next: express.NextFunction) {
  HumidityDeviceModel.find((err: any, devices: IHumidityDeviceDocument[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving humidity-devices. ${err}`});
    } else {
      // set the id to the _id provided by the db
      devices.forEach((device) => device.id = device._id);
      logger.debug(`found ${devices.length} humidity-devices`);
      let responseContentCollection: ResponseCollectionContainer<IHumidityDevice> = new ResponseCollectionContainer<IHumidityDevice>(devices);
      res.json(responseContentCollection);
    }
  });
}

export function getHumidityDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get humidity-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  HumidityDeviceModel.findById(ref, (err: any, device: IHumidityDeviceDocument) => {
    if (err) {
      res.status(404).json({error: `error retrieving humidity-device ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = device._id;
      logger.debug(`found humidity-device ${req.params.id}: ${JSON.stringify(device)}`);
      let responseContent: ResponseContainer<IHumidityDevice> = new ResponseContainer<IHumidityDevice>(device);
      res.json(responseContent);
    }
  });
}

export function deleteHumidityDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info(`delete humidity-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  HumidityDeviceModel.remove(ref, (err: any) => {
    if (err) {
      res.status(404).json({error: `error deleting humidity-device ${ref._id}. ${err}`});
    }
    logger.debug(`deleted humidity-device ${req.params.id} successfully`);
    cleanupHumidityData(req.params.id);
    res.json(ref._id);
  });
}


