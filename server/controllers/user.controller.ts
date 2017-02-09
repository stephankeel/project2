import express = require('express');
import {IUserDocument, UserModel} from "../models/user.model";
import {IUser} from "../entities/user.interface";
import {SocketService} from "../socket/socket-service";
import {GenericDeviceController} from "./generic-device.controller";

export class UserController extends GenericDeviceController<IUser, IUserDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/users",
      UserModel,
      c => new UserModel(c),
      (d, i) => UserController.updateDocument(d, i),
      id => {
      },
    );
  }

  private static updateDocument(documentFromDb: IUserDocument, inputDocument: IUserDocument) {
    documentFromDb.id = inputDocument.id;
    documentFromDb.lastname = inputDocument.lastname;
    documentFromDb.firstname = inputDocument.firstname;
    documentFromDb.type = inputDocument.type;
    documentFromDb.username = inputDocument.username;
    documentFromDb.password = inputDocument.password;
  }
}

