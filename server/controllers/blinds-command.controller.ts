'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {RequestContainer, ResponseContainer, BroadcastContainer, ContentType} from '../wire/com-container';
import {IBlindsData} from "../entities/data.interface";

export function openBlinds(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.error(`open blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
  // TODO: Implement

  res.json(`open blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
}

export function closeBlinds(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.error(`close blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
  // TODO: Implement

  res.json(`close blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
}

export function stopBlinds(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.error(`stop blinds-command ${req.params.id}: ${JSON.stringify(JSON.stringify(req.body))} ==> TO BE IMPLEMENTED`);
  // TODO: Implement

  res.json(`stop blinds-command ${req.params.id}: ${JSON.stringify(JSON.stringify(req.body))} ==> TO BE IMPLEMENTED`);
}
