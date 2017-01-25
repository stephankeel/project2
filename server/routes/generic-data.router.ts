import express = require('express');
import {Router} from "express-serve-static-core";
import {IController} from "../controllers/controller.interface";
import {IDataController} from "../controllers/data-controller.interface";

export class GenericDataRouter<T> {
  constructor(private controller: IDataController<T>, private router: Router) {
    router.route('/:id/all').get((req, res) => controller.getAllById(req, res));
    router.route('/:id/latest').get((req, res) => controller.getLatestById(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }

  public static create<T>(controller: IDataController<T>): Router {
    return new GenericDataRouter(controller, express.Router()).getRouter();
  }
}
