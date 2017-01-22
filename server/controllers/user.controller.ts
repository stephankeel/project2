'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IUserDocument, UserModel} from '../models/user.model';

export function addUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: IUserDocument = new UserModel(req.body);
  logger.info(`create user: ${user}`);
  user.save((err: any, addedUser: IUserDocument) => {
    if (err) {
      res.status(500).json({error: `error creating user ${user.username}. ${err}`});
    } else {
      // set the user.id to the _id provided by the db
      addedUser.id = addedUser._id;
      logger.debug(`created user successfully, id: ${addedUser.id}`);
      res.status(201).json({data: addedUser});
    }
  });
};

export function updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  let id = req.params.id;
  logger.info(`update user [${id}]: ${JSON.stringify(req.body)}`);
  UserModel.findById(id, (err: any, user: IUserDocument) => {
    if (err) {
      res.status(404).json({error: `user ${id} not found. ${err}`});
    } else {
      // copy the properties
      user.id = req.body.id;
      user.lastname = req.body.lastname;
      user.firstname = req.body.firstname;
      user.type = req.body.type;
      user.username = req.body.username;
      user.password = req.body.password;
      // save the updated user
      user.save((err: any, updatedUser: IUserDocument) => {
        if (err) {
          res.status(500).json({error: `error updating user ${id}. ${err}`});
        } else {
          logger.debug('updated user successfully');
          res.json({data: updatedUser});
        }
      });
    }
  });
}

export function getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
  UserModel.find((err: any, users: IUserDocument[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving users. ${err}`});
    } else {
      // set the user.id to the _id provided by the db
      users.forEach((user) => user.id = user._id);
      logger.debug(`found ${users.length} users`);
      res.json({data: users});
    }
  });
}

export function getUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get user ${req.params.id}`);
  let ref = {_id: req.params.id};
  UserModel.findById(ref, (err: any, user: IUserDocument) => {
    if (err) {
      res.status(404).json({error: `error retrieving user ${ref._id}. ${err}`});
    } else {
      // set the user.id to the _id provided by the db
      user.id = user._id;
      logger.debug(`found user ${req.params.id}: ${JSON.stringify(user)}`);
      res.json({data: user});
    }
  });
}

export function deleteUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info(`delete user ${req.params.id}`);
  let ref = {_id: req.params.id};
  UserModel.remove(ref, (err: any) => {
    if (err) {
      res.status(404).json({error: `error deleting user ${ref._id}. ${err}`});
    }
    logger.debug(`deleted user ${req.params.id} successfully`);
    res.json({data: ref._id});
  });
}


