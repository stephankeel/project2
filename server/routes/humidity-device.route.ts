'use strict';

import express = require('express');
import deviceController = require('../controllers/humidity-device.controller');
import {HumidityDeviceController} from'../controllers/humidity-device.controller';
import dataController = require('../controllers/humidity-data.controller');
import {requiresAdmin} from './authorization';
import {HumidityDataController} from "../controllers/humidity-data.controller";

export function humidityDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();
  let deviceController = new HumidityDeviceController();

  app.use('/api/devices/humidity', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post((req, res) => deviceController.add(req, res))
    .get((req, res) => deviceController.getAll(req, res));

  deviceRouter.route('/:id')
    .get((req, res) => deviceController.get(req, res))
    .put((req, res) => deviceController.update(req, res))
    .delete((req, res) => deviceController.del(req, res));

  // Data section (for any type of user)
  let dataRouter = express.Router();
  let dataController = new HumidityDataController();
  app.use('/api/data/humidity', dataRouter);
  dataRouter.route('/:id/all').get((req, res) => dataController.getAllById(req, res));
  dataRouter.route('/:id/latest').get((req, res) => dataController.getLatestById(req, res));
}
