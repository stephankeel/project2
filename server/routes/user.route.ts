'use strict';

import express = require('express');
import {requiresAdmin} from './authorization';
import {UserController} from "../controllers/user.controller";

export function userRoute(app: express.Express) {
  let router = express.Router();
  let controller = new UserController();

  app.use('/api/users', requiresAdmin, router);

  router.route('/')
    .post((req, res) => controller.add(req, res))
    .get((req, res) => controller.getAll(req, res));

  router.route('/:id')
    .get((req, res) => controller.get(req, res))
    .put((req, res) => controller.update(req, res))
    .delete((req, res) => controller.del(req, res));
}
