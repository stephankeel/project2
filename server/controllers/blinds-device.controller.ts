'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IBlindsDeviceModel, BlindsDevice} from '../models/blinds-device.model';

export function addBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let device: IBlindsDeviceModel = new BlindsDevice(req.body);
  let jsonBody: string = JSON.stringify(req.body);
  logger.info(`create blinds-device: ${jsonBody}`);
  device.save((err: any, addedDevice: IBlindsDeviceModel) => {
    if (err) {
      res.status(500).json({error: `error creating blinds-device ${device.name}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = addedDevice._id;
      logger.trace(`created blinds-device successfully, id: ${addedDevice.id}`);
      res.status(201).json({data: addedDevice});
    }
  });
};

export function updateBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let id = req.params.id;
  let jsonBody: string = JSON.stringify(req.body);
  logger.info(`update blinds-device [${id}]: ${jsonBody}`);
  BlindsDevice.findById(id, (err: any, device: IBlindsDeviceModel) => {
    if (err) {
      res.status(404).json({error: `blinds-device ${id} not found. ${err}`});
    } else {
      // copy the properties
      device.id = req.body.id;
      device.name = req.body.name;
      device.keyUp = req.body.keyUp;
      device.keyDown = req.body.keyDown;
      device.actorUp = req.body.actorUp;
      device.actorDown = req.body.actorDown;
      device.runningSeconds = req.body.runningSeconds;
      // save the updated user
      device.save((err: any, updatedDevice: IBlindsDeviceModel) => {
        if (err) {
          res.status(500).json({error: `error updating blinds-device ${id}. ${err}`});
        } else {
          logger.trace('updated blinds-device successfully');
          res.json({data: updatedDevice});
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
      res.json({data: devices});
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
      res.json({data: device});
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
    res.json({data: ref._id});
  });
}


