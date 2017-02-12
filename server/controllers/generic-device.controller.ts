import {Logger, getLogger} from '../utils/logger';
import {IDeviceDocument} from '../models/model-helper';
import {Model} from 'mongoose';
import {SocketService} from '../socket/socket-service';
import {GenericController} from './generic.controller';
import express = require('express');
const LOGGER: Logger = getLogger('GenericDeviceController');

export class GenericDeviceController<T, R extends IDeviceDocument> extends GenericController<T, R> {

  constructor(socketService: SocketService,
              namespaceName: string,
              model: Model<R>,
              createDocument: (content: T) => R,
              udpateDocument: (documentFromDb: R, inputDocument: R) => void) {
    super(socketService, namespaceName, model, createDocument, udpateDocument);
    this.registerOnCreate((value: R) => this.registerSocket(value));
    this.registerOnDelete((id: string) => this.unregisterSocket(id));
  }

  private registerSocket(value: R) {
    this.socketService.registerSocket(`${this.namespaceName}/${value.id}`);
  }

  private unregisterSocket(id: string) {
    this.socketService.registerSocket(`${this.namespaceName}/${id}`);
  }


}

