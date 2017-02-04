import {logger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import express = require('express');
import {Model} from "mongoose";
import {IController} from "./controller.interface";
import {GenericSocket} from "../socket/generic-socket";
import {SocketService} from "../socket/socket-service";
import {Logger} from "log4js";

export class GenericController<T, R extends IDeviceDocument> implements IController {
  private static logger: Logger = logger;
  private loggingPrefix: string;
  private genericSocket: GenericSocket;

  constructor(private socketService: SocketService,
              private namespaceName: string,
              private model: Model<R>,
              private createDocument: (content: T) => R,
              private udpateDocument: (documentFromDb: R, inputDocument: R) => void,
              private cleanupCallbackOnDelete: (id: string) => void,
              private websocketPreObject: boolean) {
    this.loggingPrefix = this.namespaceName;
    this.initWebsocket();
  }

  private initWebsocket() {
    this.genericSocket = this.socketService.registerSocket(this.namespaceName);
    if (this.websocketPreObject) {
      this.getAllEntities((err: any, devices: R[]) => {
        if (err) {
          GenericController.logger.error(`error retrieving ${this.loggingPrefix}. ${err}`);
        } else {
          devices.forEach((device) => {
            this.socketService.registerSocket(`${this.namespaceName}/${device._id}`);
          });
        }
      })
    }
  }

  public add(req: express.Request, res: express.Response) {
    let item: T = req.body;
    GenericController.logger.info(`create ${this.loggingPrefix}: ${JSON.stringify(item)}`);
    let device: R = this.createDocument(item);
    device.save((err: any, addedDevice: R) => {
      if (err) {
        res.status(500).json({error: `error creating ${this.loggingPrefix} ${device.name}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = addedDevice._id;
        if (this.websocketPreObject) {
          this.socketService.registerSocket(`${this.namespaceName}/${device.id}`);
        }
        this.genericSocket.create(device);
        GenericController.logger.debug(`created ${this.loggingPrefix} successfully, id: ${addedDevice.id}`);
        res.status(201).json(device);
      }
    });
  }

  public getAll(req: express.Request, res: express.Response) {
    this.getAllEntities((err: any, devices: R[]) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        devices.forEach((device) => device.id = device._id);
        GenericController.logger.debug(`found ${devices.length} ${this.loggingPrefix}`);
        res.json(devices);
      }
    });
  }

  private getAllEntities(callback?: (err: any, res: R[]) => void) {
    this.model.find(callback);
  }

  public get(req: express.Request, res: express.Response) {
    GenericController.logger.debug(`get ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.findById(ref, (err: any, device: R) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = device._id;
        GenericController.logger.debug(`found ${this.loggingPrefix} ${req.params.id}: ${JSON.stringify(device)}`);
        res.json(device);
      }
    });
  }

  public del(req: express.Request, res: express.Response) {
    GenericController.logger.info(`delete ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.remove(ref, (err: any) => {
      if (err) {
        res.status(404).json({error: `error deleting ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        this.genericSocket.del(ref._id);
        if (this.websocketPreObject) {
          this.socketService.unregisterSocket(`${this.namespaceName}/${ref._id}`);
        }
        GenericController.logger.debug(`deleted ${this.loggingPrefix} ${req.params.id} successfully`);
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
            // set the id to the _id provided by the db
            updatedDevice.id = updatedDevice._id;
            logger.debug(`updated ${this.loggingPrefix} successfully`);
            this.genericSocket.update(updatedDevice);
            res.json(updatedDevice);
          }
        });
      }
    });
  }
}

