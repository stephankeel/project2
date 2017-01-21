'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IBlindsDeviceModel, BlindsDevice} from '../models/blinds-device.model';
import {IBlindsDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';

export function addBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let requestContent: RequestContainer<IBlindsDevice> = req.body;
  let device: IBlindsDeviceModel = new BlindsDevice(requestContent.content);
  logger.info(`create blinds-device: ${JSON.stringify(requestContent)}`);
  device.save((err: any, addedDevice: IBlindsDeviceModel) => {
    if (err) {
      res.status(500).json({error: `error creating blinds-device ${device.name}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = addedDevice._id;
      logger.trace(`created blinds-device successfully, id: ${addedDevice.id}`);
      let responseContent: ResponseContainer<IBlindsDevice> = new ResponseContainer<IBlindsDevice>(device);
      res.status(201).json(responseContent);
    }
  });
};

export function updateBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let id = req.params.id;
  logger.info(`update blinds-device [${id}]: ${JSON.stringify(req.body)}`);
  BlindsDevice.findById(id, (err: any, deviceFromDb: IBlindsDeviceModel) => {
    if (err) {
      res.status(404).json({error: `blinds-device ${id} not found. ${err}`});
    } else {
      let requestContent: RequestContainer<IBlindsDevice> = req.body;
      let device: IBlindsDeviceModel = new BlindsDevice(requestContent.content);
      // copy the properties
      deviceFromDb.name = device.name;
      deviceFromDb.keyUp = device.keyUp;
      deviceFromDb.keyDown = device.keyDown;
      deviceFromDb.actorUp = device.actorUp;
      deviceFromDb.actorDown = device.actorDown;
      deviceFromDb.runningSeconds = device.runningSeconds;
      // save the updated user
      deviceFromDb.save((err: any, updatedDevice: IBlindsDeviceModel) => {
        if (err) {
          res.status(500).json({error: `error updating blinds-device ${id}. ${err}`});
        } else {
          logger.trace('updated blinds-device successfully');
          let responseContent: ResponseContainer<IBlindsDevice> = new ResponseContainer<IBlindsDevice>(updatedDevice);
          res.json(responseContent);
        }
      });
    }
  });
}

export function getAllBlindsDevices(req: express.Request, res: express.Response, next: express.NextFunction) {
  BlindsDevice.find((err: any, devices: IBlindsDeviceModel[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving blinds-devices. ${err}`});
    } else {
      // set the id to the _id provided by the db
      devices.forEach((device) => device.id = device._id);
      logger.debug(`found ${devices.length} blinds-devices`);
      let responseContentCollection: ResponseCollectionContainer<IBlindsDevice> = new ResponseCollectionContainer<IBlindsDevice>(devices);
      res.json(responseContentCollection);
    }
  });
}

export function getBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get blinds-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  BlindsDevice.findById(ref, (err: any, device: IBlindsDeviceModel) => {
    if (err) {
      res.status(404).json({error: `error retrieving blinds-device ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = device._id;
      logger.debug(`found blinds-device ${req.params.id}: ${JSON.stringify(device)}`);
      let responseContent: ResponseContainer<IBlindsDevice> = new ResponseContainer<IBlindsDevice>(device);
      res.json(responseContent);
    }
  });
}

export function deleteBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info(`delete blinds-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  BlindsDevice.remove(ref, (err: any) => {
    if (err) {
      res.status(404).json({error: `error deleting blinds-device ${ref._id}. ${err}`});
    }
    logger.debug(`deleted blinds-device ${req.params.id} successfully`);
    res.json(ref._id);
  });
}


