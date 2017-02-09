import {Logger, getLogger} from "../utils/logger";
import {IDeviceDocument} from "../models/model-helper";
import {Model} from "mongoose";
import {SocketService} from "../socket/socket-service";
import {Engine} from "../logic/engine";
import {GenericController} from "./generic.controller";
import {GenericSubject} from "./generic-subject";
import express = require('express');
const LOGGER: Logger = getLogger('GenericDeviceController');

export class GenericDeviceController<T, R extends IDeviceDocument> extends GenericController<T, R> {

  constructor(socketService: SocketService,
              namespaceName: string,
              model: Model<R>,
              createDocument: (content: T) => R,
              udpateDocument: (documentFromDb: R, inputDocument: R) => void,
              cleanupCallbackOnDelete: (id: string) => void) {
    super(socketService, namespaceName, model, createDocument, udpateDocument, cleanupCallbackOnDelete);
    super.init(this.createDeviceSubject());
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

