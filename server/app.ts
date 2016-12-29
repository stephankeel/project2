'use strict';

import express = require('express');
import bodyParser = require('body-parser');
let createError = require('http-errors');

import {authenticationRoute} from './routes/authentication';
import {userRoute} from './routes/user.route';
import {DBService} from './models/db.service';

export const HOSTNAME: string = '127.0.0.1';
const PORT: number = 3001;

// Start the database service
DBService.init(HOSTNAME);

let errorHandler = function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(`ErrorHandler: ${err.stack}`);
    res.status(500).send(err.message);
}

let inputLogger = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
}

let outputLogger = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(`Response with status code: ${res.statusCode}`);
    next();
}

let app: express.Express = express();

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

app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    next(createError(404, `No route found for ${req.method} ${req.url}`));
});

app.use(outputLogger);
app.use(errorHandler);

app.listen(PORT, HOSTNAME, () => {
    console.log(`Homeautomation server running at http://${HOSTNAME}:${PORT}/`);
});


