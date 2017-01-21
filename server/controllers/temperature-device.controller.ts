'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {ITemperatureDeviceModel, TemperatureDevice} from '../models/temperature-device.model';
import {ITemperatureDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';

export function addTemperatureDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let requestContent: RequestContainer<ITemperatureDevice> = req.body;
  let device: ITemperatureDeviceModel = new TemperatureDevice(requestContent.content);
  logger.info(`create temperature-device: ${JSON.stringify(requestContent)}`);
  device.save((err: any, addedDevice: ITemperatureDeviceModel) => {
    if (err) {
      res.status(500).json({error: `error creating temperature-device ${device.name}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = addedDevice._id;
      logger.trace(`created temperature-device successfully, id: ${addedDevice.id}`);
      let responseContent: ResponseContainer<ITemperatureDevice> = new ResponseContainer<ITemperatureDevice>(device);
      res.status(201).json(responseContent);
    }
  });
};

export function updateTemperatureDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let id = req.params.id;
  logger.info(`update temperature-device [${id}]: ${JSON.stringify(req.body)}`);
  TemperatureDevice.findById(id, (err: any, deviceFromDb: ITemperatureDeviceModel) => {
    if (err) {
      res.status(404).json({error: `temperature-device ${id} not found. ${err}`});
    } else {
      let requestContent: RequestContainer<ITemperatureDevice> = req.body;
      let device: ITemperatureDeviceModel = new TemperatureDevice(requestContent.content);
      // copy the properties
      deviceFromDb.name = device.name;
      deviceFromDb.port = device.port;
      // save the updated user
      deviceFromDb.save((err: any, updatedDevice: ITemperatureDeviceModel) => {
        if (err) {
          res.status(500).json({error: `error updating temperature-device ${id}. ${err}`});
        } else {
          logger.trace('updated temperature-device successfully');
          let responseContent: ResponseContainer<ITemperatureDevice> = new ResponseContainer<ITemperatureDevice>(updatedDevice);
          res.json(responseContent);
        }
      });
    }
  });
}

export function getAllTemperatureDevices(req: express.Request, res: express.Response, next: express.NextFunction) {
  TemperatureDevice.find((err: any, devices: ITemperatureDeviceModel[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving temperature-devices. ${err}`});
    } else {
      // set the id to the _id provided by the db
      devices.forEach((device) => device.id = device._id);
      logger.debug(`found ${devices.length} temperature-devices`);
      let responseContentCollection: ResponseCollectionContainer<ITemperatureDevice> = new ResponseCollectionContainer<ITemperatureDevice>(devices);
      res.json(responseContentCollection);
    }
  });
}

export function getTemperatureDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get temperature-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  TemperatureDevice.findById(ref, (err: any, device: ITemperatureDeviceModel) => {
    if (err) {
      res.status(404).json({error: `error retrieving temperature-device ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = device._id;
      logger.debug(`found temperature-device ${req.params.id}: ${JSON.stringify(device)}`);
      let responseContent: ResponseContainer<ITemperatureDevice> = new ResponseContainer<ITemperatureDevice>(device);
      res.json(responseContent);
    }
  });
}

export function deleteTemperatureDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info(`delete temperature-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  TemperatureDevice.remove(ref, (err: any) => {
    if (err) {
      res.status(404).json({error: `error deleting temperature-device ${ref._id}. ${err}`});
    }
    logger.debug(`deleted temperature-device ${req.params.id} successfully`);
    res.json(ref._id);
  });
}


