'use strict';

import express = require('express');
import controller = require('../controllers/user.controller');
import {requiresAdmin} from './authorization';

export function userRoute(app: express.Express) {
  let router = express.Router();

  app.use('/api/users', requiresAdmin, router);

  router.route('/')
    .post(controller.addUser)
    .get(controller.getAllUsers);

  router.route('/:id')
    .get(controller.getUser)
    .put(controller.updateUser)
    .delete(controller.deleteUser)
}
