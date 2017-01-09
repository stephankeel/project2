'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import controller = require('../controllers/user.controller');
import {UserType} from '../entities/user-type';

export function requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.ADMIN);
  if (valid) {
    logger.info(`user is authorized for ${req.url}`);
    next();
  } else {
    logger.error(`user ${req.user.username} is authorized for ${req.url}`);
    res.status(403).json({error: `not authorized to use ${req.url}`});
  }

}
