import {logger} from '../utils/logger';
import express = require('express');

export class BlindsCommandController {
  public openBlinds(req: express.Request, res: express.Response) {
    logger.error(`open blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
    // TODO: Implement

    res.json(`open blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
  }

  public closeBlinds(req: express.Request, res: express.Response) {
    logger.error(`close blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
    // TODO: Implement

    res.json(`close blinds-command ${req.params.id}: ${JSON.stringify(req.body)} ==> TO BE IMPLEMENTED`);
  }

  public stopBlinds(req: express.Request, res: express.Response) {
    logger.error(`stop blinds-command ${req.params.id}: ${JSON.stringify(JSON.stringify(req.body))} ==> TO BE IMPLEMENTED`);
    // TODO: Implement

    res.json(`stop blinds-command ${req.params.id}: ${JSON.stringify(JSON.stringify(req.body))} ==> TO BE IMPLEMENTED`);
  }
}
