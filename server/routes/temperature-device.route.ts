'use strict';

import express = require('express');
import controller = require('../controllers/temperature-device.controller');
import {requiresAdmin} from './authorization';

export function temperatureDeviceRoute(app: express.Express) {
  let router = express.Router();

  app.use('/api/devices/temperature', requiresAdmin, router);

  router.route('/')
    .post(controller.addTemperatureDevice)
    .get(controller.getAllTemperatureDevices);

  router.route('/:id')
    .get(controller.getTemperatureDevice)
    .put(controller.updateTemperatureDevice)
    .delete(controller.deleteTemperatureDevice)
}
