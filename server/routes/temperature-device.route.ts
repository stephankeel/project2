'use strict';

import express = require('express');
import deviceController = require('../controllers/temperature-device.controller');
import {TemperatureDeviceController} from'../controllers/temperature-device.controller';
import dataController = require('../controllers/temperature-data.controller');
import {requiresAdmin} from './authorization';
import {TemperatureDataController} from "../controllers/temperature-data.controller";

export function temperatureDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();
  let controller = new TemperatureDeviceController();

  app.use('/api/devices/temperature', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post((req, res) => controller.add(req, res))
    .get((req, res) => controller.getAll(req, res));

  deviceRouter.route('/:id')
    .get((req, res) => controller.get(req, res))
    .put((req, res) => controller.update(req, res))
    .delete((req, res) => controller.del(req, res));

  // Data section (for any type of user)
  let dataRouter = express.Router();
  let dataController = new TemperatureDataController();
  app.use('/api/data/humidity', dataRouter);
  dataRouter.route('/:id/all').get((req, res) => dataController.getAllById(req, res));
  dataRouter.route('/:id/latest').get((req, res) => dataController.getLatestById(req, res));

}
