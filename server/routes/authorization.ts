'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import controller = require('../controllers/user.controller');
import {UserType} from '../entities/user-type';

export function requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.ADMIN);
  if (valid) {
    logger.info(`user is authorized for ${req.baseUrl}`);
    next();
  } else {
    logger.error(`user ${req.user.username} is not authorized for ${req.baseUrl}`);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

export function requiresStandardOrAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.STANDARD || req.user.type == UserType.ADMIN);
  if (valid) {
    logger.info(`user is authorized for ${req.baseUrl}`);
    next();
  } else {
    logger.error(`user ${req.user.username} is not authorized for ${req.baseUrl}`);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}
