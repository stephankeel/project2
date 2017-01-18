'use strict';

import express = require('express');
import bodyParser = require('body-parser');
import createError = require('http-errors');
import log4js = require('log4js');

import {logger} from './utils/logger';
import {authenticationRoute} from './routes/authentication';
import {userRoute} from './routes/user.route';
import {blindsDeviceRoute} from './routes/blinds-device.route';
import {DBService} from './models/db.service';

export const HOSTNAME: string = 'localhost';
const PORT: number = 3001;

// Start the database service
DBService.init(HOSTNAME);

let errorHandler = function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.error(`ErrorHandler: ${err.stack}`);
  res.status(500).send(err.message);
}

let inputLogger = function (req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`Request: ${req.method} ${req.url}`);
  next();
}

let outputLogger = function (req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`Response with status code: ${res.statusCode}`);
  next();
}

let app: express.Express = express();

app.use(log4js.connectLogger(logger, {
  level: 'trace',
  format: 'express --> :method :url :status :req[Accept] :res[Content-Type]'
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(inputLogger);

app.use('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
  next();
});

app.use('/about', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('Homeautomation Project by D.Leuenberger and St.Keel');
});

app.use(authenticationRoute);
userRoute(app);
blindsDeviceRoute(app);

app.use('/api', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  next(createError(404, `No route found for ${req.method} ${req.url}`));
});

app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(outputLogger);
app.use(errorHandler);

// HOSTNAME must not be set to be accessable from remote!!!
app.listen(PORT, () => {
  logger.info(`Homeautomation server running at http://${HOSTNAME}:${PORT}/`);
});


