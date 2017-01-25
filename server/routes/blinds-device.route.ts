'use strict';

import express = require('express');
import deviceController = require('../controllers/blinds-device.controller');
import dataController = require('../controllers/blinds-data.controller');
import commandController = require('../controllers/blinds-command.controller');
import {requiresAdmin, requiresStandardOrAdmin} from './authorization';
import {BlindsDeviceController} from "../controllers/blinds-device.controller";
import {BlindsDataController} from "../controllers/blinds-data.controller";
import {BlindsCommandController} from "../controllers/blinds-command.controller";

export function blindsDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();
  let deviceController = new BlindsDeviceController();
  app.use('/api/devices/blinds', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post((req, res) => deviceController.add(req, res))
    .get((req, res) => deviceController.getAll(req, res))

  deviceRouter.route('/:id')
    .get((req, res) => deviceController.get(req, res))
    .put((req, res) => deviceController.update(req, res))
    .delete((req, res) => deviceController.del(req, res));

  // Data section (for any type of user)
  let dataRouter = express.Router();
  let dataController = new BlindsDataController();
  app.use('/api/data/blinds', dataRouter);

  dataRouter.route('/:id/all').get((req, res) => dataController.getAllById(req, res));
  dataRouter.route('/:id/latest').get((req, res) => dataController.getLatestById(req, res));
  // Command section (only for standard users including admins)
  let commandRouter = express.Router();
  let commandController = new BlindsCommandController();

  // TODO: change order is use statement
  app.use('/api/command/blinds', commandRouter, requiresStandardOrAdmin);
  commandRouter.route('/:id/open').put((req, res) => commandController.openBlinds(req, res));
  commandRouter.route('/:id/close').put((req, res) => commandController.closeBlinds(req, res));
  commandRouter.route('/:id/stop').put((req, res) => commandController.stopBlinds(req, res));
}
