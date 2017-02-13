'use strict';

import {Logger, getLogger} from '../utils/logger';
import express = require('express');
import controller = require('../controllers/user.controller');
import {UserType} from '../entities/user-type';

const LOGGER: Logger = getLogger('authorization');
const METHODS_FOR_ADMIN: string = 'PUT POST DELETE';

export function requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.ADMIN);
  if (valid) {
    LOGGER.info(`${req.user.username} is authorized to use ${req.baseUrl}`);
    next();
  } else {
    logError(req);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

export function requiresAdminExceptForGet(req: express.Request, res: express.Response, next: express.NextFunction) {
  let method: string = req.method.toUpperCase();
  if (METHODS_FOR_ADMIN.indexOf(method) > -1) {
    // requires admin
    let valid: boolean = req.user && (req.user.type == UserType.ADMIN);
    if (valid) {
      LOGGER.info(`${req.user.username} is authorized to use ${req.baseUrl}`);
      next();
    } else {
      logError(req);
      res.status(403).json({error: `not authorized to use ${method} on ${req.baseUrl}`});
    }
  } else {
    // requires any authenticated user
    let valid: boolean = req.user && true;
    if (valid) {
      LOGGER.info(`${req.user.username} is authorized to use ${method} on ${req.baseUrl}`);
      next();
    } else {
      logError(req);
      res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
    }
  }
}

export function requiresStandardOrAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.STANDARD || req.user.type == UserType.ADMIN);
  if (valid) {
    LOGGER.info(`${req.user.username} is authorized for ${req.baseUrl}`);
    next();
  } else {
    logError(req);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

export function requiresAuthenticatedUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && true;
  if (valid) {
    LOGGER.info(`${req.user.username} is authorized for ${req.baseUrl}`);
    next();
  } else {
    logError(req);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

function logError(req: express.Request): void {
  if (req.user) {
    LOGGER.error(`user ${req.user.username} is not authorized for ${req.method} on ${req.baseUrl}`);
  } else {
    LOGGER.error(`user not provided, thus not authorized for ${req.baseUrl}`);
  }
}
