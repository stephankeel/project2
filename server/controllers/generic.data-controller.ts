import {Logger, getLogger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import express = require('express');
import {Model} from "mongoose";
import {IDataController} from "./data-controller.interface";
import {SocketService} from "../socket/socket-service";
import {IData} from "../entities/data.interface";
import {DeviceType} from '../entities/device-type';

const LOGGER: Logger = getLogger('GenericDataController');

export class GenericDataController<T extends IData, R extends IDeviceDocument> implements IDataController<T> {

  private static dataControllerMap: Map<DeviceType, IDataController<any>> = new Map<DeviceType, IDataController<any>>();
  private loggingPrefix: string;

  constructor(private socketService: SocketService,
              private namespaceName: string,
              private deviceType: DeviceType,
              private model: Model<R>,
              private createDocument: (content: T) => R) {
    this.loggingPrefix = `${this.namespaceName}-data`;
    GenericDataController.dataControllerMap.set(deviceType, this);
  }

  public static getDataController<T>(deviceType: DeviceType): IDataController<T> {
    return this.dataControllerMap.get(deviceType);
  }

  public getAllById(req: express.Request, res: express.Response) {
    LOGGER.debug(`getAllById ${this.loggingPrefix} ${req.params.id}`);
    // TODO: check if deviceId is correct (changed from _id) DL
    let ref = {deviceId: req.params.id};
    this.model.find(ref, (err: any, data: R[]) => {
      if (err || !data) {
        res.status(404).json({error: `error retrieving all ${this.loggingPrefix} with deviceId ${ref.deviceId}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        // TODO: should we create new Objects here, to prevent two properties (id and _id)?
        data.forEach((rec) => rec.id = rec._id);
        LOGGER.debug(`found ${data.length} ${this.loggingPrefix} records`);
        res.json(data);
      }
    });
  }

  public getLatestById(req: express.Request, res: express.Response) {
    LOGGER.debug(`get latest ${this.loggingPrefix} record ${req.params.id}`);
    // TODO: check if deviceId is correct (changed from _id) DL
    let ref = {deviceId: req.params.id};
    let sort = {timestamp: -1};
    this.model.findOne(ref).sort(sort).exec((err: any, data: R) => {
      if (err || !data) {
        res.status(404).json({error: `error retrieving latest ${this.loggingPrefix} record ${ref.deviceId}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        data.id = data._id;
        LOGGER.debug(`found latest ${this.loggingPrefix} record ${req.params.id}: ${JSON.stringify(data)}`);
        res.json(data);
      }
    });
  }

  public addDataRecord(data: T) {
    let dataModel: R = this.createDocument(data);
    LOGGER.debug(`add ${this.loggingPrefix}: ${JSON.stringify(data)}`);
    dataModel.save((err: any, addedData: R) => {
      if (err) {
        LOGGER.error(`error adding ${this.loggingPrefix} ${JSON.stringify(data)}. ${err}`);
      } else {
        // set the id to the _id provided by the db
        data.id = addedData._id;
        this.socketService.getSocket(`${this.namespaceName}/${data.deviceId}`).create(data);
        LOGGER.debug(`added ${this.loggingPrefix} successfully, id: ${data.id}`);
      }
    });
  };

  public deleteAllById(id: string) {
    // TODO: untested code
    LOGGER.debug(`delete all ${this.loggingPrefix} ${id}`);
    let ref = {deviceId: id};
    this.model.findById(ref, (err: any, data: R[]) => {
      if (err || !data) {
        return;
      } else {
        // delete all entries with given deviceId
        data.forEach((rec) => {
          LOGGER.debug(`delete ${this.loggingPrefix} ${rec._id}`);
          let ref = {_id: rec._id};
          this.model.remove(ref);
        });
      }
    });
    LOGGER.debug(`deleted all ${this.loggingPrefix} entries with deviceId ${id} successfully`);
  }
}

