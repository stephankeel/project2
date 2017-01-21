'use strict';

import express = require('express');
import controller = require('../controllers/humidity-device.controller');
import {requiresAdmin} from './authorization';

export function humidityDeviceRoute(app: express.Express) {
  let router = express.Router();

  app.use('/api/devices/humidity', requiresAdmin, router);

  router.route('/')
    .post(controller.addHumidityDevice)
    .get(controller.getAllHumidityDevices);

  router.route('/:id')
    .get(controller.getHumidityDevice)
    .put(controller.updateHumidityDevice)
    .delete(controller.deleteHumidityDevice)
}
