'use strict';

import express = require('express');
import deviceController = require('../controllers/blinds-device.controller');
import dataController = require('../controllers/blinds-data.controller');
import commandController = require('../controllers/blinds-command.controller');
import {requiresAdmin, requiresStandardOrAdmin} from './authorization';
import {BlindsDeviceController} from "../controllers/blinds-device.controller";

export function blindsDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();
  let controller = new BlindsDeviceController();

  app.use('/api/devices/blinds', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post((req, res) => controller.add(req, res))
    .get((req, res) => controller.getAll(req, res))

  deviceRouter.route('/:id')
    .get((req, res) => controller.get(req, res))
    .put((req, res) => controller.update(req, res))
    .delete((req, res) => controller.del(req, res));

  // Data section (for any type of user)
  let dataRouter = express.Router();
  app.use('/api/data/blinds', dataRouter);
  dataRouter.route('/:id/all').get(dataController.getBlindsData);
  dataRouter.route('/:id/latest').get(dataController.getLatestBlindsDataRecord);

  // Command section (only for standard users including admins)
  let commandRouter = express.Router();
  app.use('/api/command/blinds', commandRouter, requiresStandardOrAdmin);
  commandRouter.route('/:id/open').put(commandController.openBlinds);
  commandRouter.route('/:id/close').put(commandController.closeBlinds);
  commandRouter.route('/:id/stop').put(commandController.stopBlinds);
}
