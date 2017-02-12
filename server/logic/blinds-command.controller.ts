import {Logger, getLogger} from '../utils/logger';
import express = require('express');
import {Engine} from '../logic/engine';

const LOGGER: Logger = getLogger('BlindsCommandController');

export class BlindsCommandController {

  constructor(private engine: Engine) {
  }

  public openBlinds(req: express.Request, res: express.Response) {
    LOGGER.debug(`open blinds-command ${req.params.id}: ${JSON.stringify(req.body)}`);
    this.engine.openBlinds(req.params.id);
    res.status(200);
  }

  public closeBlinds(req: express.Request, res: express.Response) {
    LOGGER.debug(`close blinds-command ${req.params.id}: ${JSON.stringify(req.body)}`);
    this.engine.closeBlinds(req.params.id);
    res.status(200);
  }

  public stopBlinds(req: express.Request, res: express.Response) {
    LOGGER.debug(`stop blinds-command ${req.params.id}: ${JSON.stringify(JSON.stringify(req.body))}`);
    this.engine.stopBlinds(req.params.id);
    res.status(200);
  }
}
