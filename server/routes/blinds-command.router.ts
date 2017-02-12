import express = require('express');
import {Router} from "express-serve-static-core";
import {BlindsCommandController} from "../logic/blinds-command.controller";
import {Engine} from '../logic/engine';

export class BlindsCommandRouter {
  constructor(private controller: BlindsCommandController, private router: Router) {
    router.route('/:id/open').put((req, res) => controller.openBlinds(req, res));
    router.route('/:id/close').put((req, res) => controller.closeBlinds(req, res));
    router.route('/:id/stop').put((req, res) => controller.stopBlinds(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }

  public static create(engine: Engine): Router {
    return new BlindsCommandRouter(new BlindsCommandController(engine), express.Router()).getRouter();
  }
}
