import {Logger, getLogger} from '../utils/logger';
import express = require('express');
import {Engine} from '../logic/engine';
import {IBlindsCommand} from '../entities/blinds-comnnad.interface';
import {BlindsAction} from '../entities/blinds-action';

const LOGGER: Logger = getLogger('BlindsCommandController');

export class BlindsCommandController {

  constructor(private engine: Engine) {
  }

  public executeCommand(req: express.Request, res: express.Response) {
    let command: IBlindsCommand = req.body as IBlindsCommand;
    LOGGER.debug(`executeCommand ${command}`);
    switch (command.action) {
      case BlindsAction.OPEN:
        this.engine.openBlindsCommand(command.id);
        break;
      case BlindsAction.CLOSE:
        this.engine.closeBlindsCommand(command.id);
        break;
      case BlindsAction.STOP:
        this.engine.stopBlindsCommand(command.id);
        break;
      default:
        let errorStr: string = `invalid command ${JSON.stringify(command)}`;
        LOGGER.error(`executeCommand: ${errorStr}`);
        res.status(404).json({error: `${errorStr}`});
    }
    res.json(true);
  }

}
