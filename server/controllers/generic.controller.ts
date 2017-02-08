import {Logger, getLogger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import express = require('express');
import {Model} from "mongoose";
import {IController} from "./controller.interface";
import {GenericSocket} from "../socket/generic-socket";
import {SocketService} from "../socket/socket-service";
import {Engine} from '../logic/engine';

const LOGGER: Logger = getLogger('GenericController');

export class GenericController<T, R extends IDeviceDocument> implements IController {
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
          LOGGER.error(`error retrieving ${this.loggingPrefix}. ${err}`);
        } else {
          devices.forEach((device) => {
            // set the id to the _id provided by the db
            device.id = device._id;
            this.socketService.registerSocket(`${this.namespaceName}/${device._id}`);

            // TODO: mode to GenericDeviceController as soon as available
            this.informOnAdd(device);
          });
        }
      })
    }
  }

  public add(req: express.Request, res: express.Response) {
    let item: T = req.body;
    LOGGER.info(`create ${this.loggingPrefix}: ${JSON.stringify(item)}`);
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
        LOGGER.debug(`created ${this.loggingPrefix} successfully, id: ${addedDevice.id}`);

        // TODO: move to GenericDeviceController as soon as available
        this.informOnAdd(device);

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
        LOGGER.debug(`found ${devices.length} ${this.loggingPrefix}`);
        res.json(devices);
      }
    });
  }

  private getAllEntities(callback?: (err: any, res: R[]) => void) {
    this.model.find(callback);
  }

  public get(req: express.Request, res: express.Response) {
    LOGGER.debug(`get ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.findById(ref, (err: any, device: R) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = device._id;
        LOGGER.debug(`found ${this.loggingPrefix} ${req.params.id}: ${JSON.stringify(device)}`);
        res.json(device);
      }
    });
  }

  public del(req: express.Request, res: express.Response) {
    LOGGER.info(`delete ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.remove(ref, (err: any) => {
      if (err) {
        res.status(404).json({error: `error deleting ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        this.genericSocket.del(ref._id);
        if (this.websocketPreObject) {
          this.socketService.unregisterSocket(`${this.namespaceName}/${ref._id}`);
        }
        LOGGER.debug(`deleted ${this.loggingPrefix} ${req.params.id} successfully`);
        this.cleanupCallbackOnDelete(req.params.id);

        // TODO: move to GenericDeviceController as soon as available
        this.informOnDelete(ref._id);
      }
      res.json(ref._id);
    });
  }

  public update(req: express.Request, res: express.Response) {
    let id = req.params.id;
    LOGGER.info(`update ${this.loggingPrefix} [${id}]: ${JSON.stringify(req.body)}`);
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
            LOGGER.debug(`updated ${this.loggingPrefix} successfully`);
            this.genericSocket.update(updatedDevice);

            // TODO: move to GenericDeviceController as soon as available
            this.informOnUpdate(device);

            res.json(updatedDevice);
          }
        });
      }
    });
  }

  // TODO: move the following 3 methods to GenericDeviceController as soon as available. They will be overwritten by the device specific controller!
  // TODO: remove the import of Enigine as well
  protected informOnAdd(device: R): void {
  }
  protected informOnUpdate(device: R): void {
    Engine.getInstance().updateDevice(device);
  }
  protected informOnDelete(id: any): void {
    Engine.getInstance().removeDevice(id);
  }

}

