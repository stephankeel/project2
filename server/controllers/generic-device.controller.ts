import {logger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import {Model} from "mongoose";
import {SocketService} from "../socket/socket-service";
import {Logger} from "log4js";
import {Engine} from "../logic/engine";
import {GenericController} from "./generic.controller";
import {GenericSubject} from "./generic-subject";
import express = require('express');
import {isUndefined} from "util";

export class GenericDeviceController<T, R extends IDeviceDocument> extends GenericController<T, R> {
  private static logger1: Logger = logger;

  constructor(socketService: SocketService,
              namespaceName: string,
              model: Model<R>,
              createDocument: (content: T) => R,
              udpateDocument: (documentFromDb: R, inputDocument: R) => void,
              cleanupCallbackOnDelete: (id: string) => void) {
    super(socketService, namespaceName, model, createDocument, udpateDocument, cleanupCallbackOnDelete);
    super.init(this.createDeviceSubject());
    this.initDevices();
  }

  private createDeviceSubject() : GenericSubject<string, R> {
    let genericSubject: GenericSubject<string, R> = new GenericSubject();
    genericSubject.addCreateListener((value: R) => this.socketService.registerSocket(`${this.namespaceName}/${value.id}`));
    genericSubject.addDeleteListener((value: string) => this.socketService.unregisterSocket(`${this.namespaceName}/${value}`));

    genericSubject.addCreateListener((value: R) => this.informOnAdd(value));
    genericSubject.addUpdateListener((value: R) => this.informOnUpdate(value));
    genericSubject.addDeleteListener((value: string) => this.informOnDelete(value));
    return genericSubject;
  }

  private initDevices() {
    super.getAllEntities((err: any, devices: R[]) => {
      if (err) {
        GenericDeviceController.logger1.error(`error retrieving ${this.namespaceName}. ${err}`);
      } else {
        devices.forEach((device) => {
          // set the id to the _id provided by the db
          device.id = device._id;
          this.socketService.registerSocket(`${this.namespaceName}/${device._id}`);
          this.informOnAdd(device);
        });
      }
    })
  }

  protected informOnAdd(device: R): void {
  }

  protected informOnUpdate(device: R): void {
    Engine.getInstance().updateDevice(device);
  }

  // TODO: should we use string instead of any for the type of id?
  protected informOnDelete(id: any): void {
    Engine.getInstance().removeDevice(id);
  }

}

