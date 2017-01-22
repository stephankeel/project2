'use strict';

import express = require('express');
import deviceController = require('../controllers/humidity-device.controller');
import dataController = require('../controllers/humidity-data.controller');
import {requiresAdmin} from './authorization';

export function humidityDeviceRoute(app: express.Express) {
  // Device configuration section (only for admin users)
  let deviceRouter = express.Router();

  app.use('/api/devices/humidity', requiresAdmin, deviceRouter);

  deviceRouter.route('/')
    .post(deviceController.addHumidityDevice)
    .get(deviceController.getAllHumidityDevices);

  deviceRouter.route('/:id')
    .get(deviceController.getHumidityDevice)
    .put(deviceController.updateHumidityDevice)
    .delete(deviceController.deleteHumidityDevice);

  // Data section (for any type of user)
  let dataRouter = express.Router();
  app.use('/api/data/humidity', dataRouter);
  dataRouter.route('/:id/all').get(dataController.getHumidityData);
  dataRouter.route('/:id/latest').get(dataController.getLatestHumidityDataRecord);

}
