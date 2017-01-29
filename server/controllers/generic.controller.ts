'use strict';

import {logger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import {IDevice} from "../entities/device.interface";
import {
  RequestContainer, ResponseContainer, ResponseCollectionContainer,
  BroadcastContainer
} from "../wire/com-container";
import express = require('express');
import {Model} from "mongoose";
import {IController} from "./controller.interface";
import {GenericSocket} from "../socket/generic-socket";

export class GenericController<T, R extends IDeviceDocument> implements IController {
  constructor(private genericSocket: GenericSocket,
              private loggingPrefix: string,
              private model: Model<R>,
              private createDocument: (content: T) => R,
              private udpateDocument: (documentFromDb: R, inputDocument: R) => void,
              private createResponseContainer: (content: R) => ResponseContainer<T>,
              private createResponseCollectionContainer: (content: R[]) => ResponseCollectionContainer<T>,
//              private createBroadcastContainer: (clientContext: string, content: R) => BroadcastContainer<T>,
              private cleanupCallbackOnDelete: (id: string) => void) {
  }

  public add(req: express.Request, res: express.Response) {
    let item: T = req.body;
    logger.info(`create ${this.loggingPrefix}: ${JSON.stringify(item)}`);
    let device: R = this.createDocument(item);
    device.save((err: any, addedDevice: R) => {
      if (err) {
        res.status(500).json({error: `error creating ${this.loggingPrefix} ${device.name}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = addedDevice._id;
        this.genericSocket.create(device);
        logger.debug(`created ${this.loggingPrefix} successfully, id: ${addedDevice.id}`);
        let responseContainer: ResponseContainer<T> = this.createResponseContainer(device);
        res.status(201).json(responseContainer);
      }
    });
  }

  public getAll(req: express.Request, res: express.Response) {
    this.model.find((err: any, devices: R[]) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        devices.forEach((device) => device.id = device._id);
        logger.debug(`found ${devices.length} ${this.loggingPrefix}`);
        res.json(devices);
      }
    });
  }

  public get(req: express.Request, res: express.Response) {
    logger.debug(`get ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.findById(ref, (err: any, device: R) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = device._id;
        logger.debug(`found ${this.loggingPrefix} ${req.params.id}: ${JSON.stringify(device)}`);
        res.json(device);
      }
    });
  }

  public del(req: express.Request, res: express.Response) {
    logger.info(`delete ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.remove(ref, (err: any) => {
      if (err) {
        res.status(404).json({error: `error deleting ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        this.genericSocket.del(ref._id);
        logger.debug(`deleted ${this.loggingPrefix} ${req.params.id} successfully`);
        this.cleanupCallbackOnDelete(req.params.id);
      }
      res.json(ref._id);
    });
  }

  public update(req: express.Request, res: express.Response) {
    let id = req.params.id;
    logger.info(`update ${this.loggingPrefix} [${id}]: ${JSON.stringify(req.body)}`);
    this.model.findById(id, (err: any, deviceFromDb: R) => {
      if (err) {
        res.status(404).json({error: `${this.loggingPrefix} ${id} not found. ${err}`});
      } else {
        let item: T = req.body;
        let device: R = this.createDocument(item);
        // copy the properties
        this.udpateDocument(deviceFromDb, device);
        // save the updated user
        deviceFromDb.save((err: any, updatedDevice: R) => {
          if (err) {
            res.status(500).json({error: `error updating ${this.loggingPrefix} ${id}. ${err}`});
          } else {
            logger.debug(`updated ${this.loggingPrefix} successfully`);
            this.genericSocket.update(updatedDevice);
            res.json(updatedDevice);
          }
        });
      }
    });
  }
}

