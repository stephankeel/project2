'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import controller = require('../controllers/user.controller');

export function requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = true;
  // TODO: check that requesting user is of requested type
  if (valid) {
    logger.info(`user is authorized for ${req.url}`);
    next();
  } else {
    res.status(403).json({error: `not authorized to use ${req.url}`});
  }

}
