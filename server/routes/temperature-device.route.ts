'use strict';

import express = require('express');
import deviceController = require('../controllers/temperature-device.controller');
import dataController = require('../controllers/temperature-data.controller');
import {requiresAdmin} from './authorization';

export function temperatureDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();

  app.use('/api/devices/temperature', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post(deviceController.addTemperatureDevice)
    .get(deviceController.getAllTemperatureDevices);

  deviceRouter.route('/:id')
    .get(deviceController.getTemperatureDevice)
    .put(deviceController.updateTemperatureDevice)
    .delete(deviceController.deleteTemperatureDevice);

  // Data section (for any type of user)
  let dataRouter = express.Router();
  app.use('/api/data/temperature', dataRouter);
  dataRouter.route('/:id/all').get(dataController.getTemperatureData);
  dataRouter.route('/:id/latest').get(dataController.getLatestTemperatureDataRecord);

}
