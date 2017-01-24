'use strict';

import express = require('express');
import deviceController = require('../controllers/humidity-device.controller');
import {HumidityDeviceController} from'../controllers/humidity-device.controller';
import dataController = require('../controllers/humidity-data.controller');
import {requiresAdmin} from './authorization';

export function humidityDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();
  let controller = new HumidityDeviceController();

  app.use('/api/devices/humidity', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post((req, res) => controller.add(req, res))
    .get((req, res) => controller.getAll(req, res))

  deviceRouter.route('/:id')
    .get((req, res) => controller.get(req, res))
    .put((req, res) => controller.update(req, res))
    .delete((req, res) => controller.del(req, res));

  // Data section (for any type of user)
  let dataRouter = express.Router();
  app.use('/api/data/humidity', dataRouter);
  dataRouter.route('/:id/all').get(dataController.getHumidityData);
  dataRouter.route('/:id/latest').get(dataController.getLatestHumidityDataRecord);
}
