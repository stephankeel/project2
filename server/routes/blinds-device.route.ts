'use strict';

import express = require('express');
import controller = require('../controllers/blinds-device.controller');
import {requiresAdmin} from './authorization';

export function blindsDeviceRoute(app: express.Express) {
  let router = express.Router();

  app.use('/api/devices/blinds', requiresAdmin, router);

  router.route('/')
    .post(controller.addBlindsDevice)
    .get(controller.getAllBlindsDevices);

  router.route('/:id')
    .get(controller.getBlindsDevice)
    .put(controller.updateBlindsDevice)
    .delete(controller.deleteBlindsDevice)
}
