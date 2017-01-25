import * as express from "express";
import * as bodyParser from "body-parser";
import * as createError from "http-errors";
import * as log4js from "log4js";
import {logger} from './utils/logger';
import {authenticationRoute} from './routes/authentication';
import {DBService} from './models/db.service';
import * as http from "http";
import * as path from "path";
import * as socketIo from "socket.io";
import {GenericDataSocket} from "./socket/generic-data-socket";
import {GenericDataGenerator} from "./socket/generic-data-generator";
import {ITemperatureData} from "./entities/data.interface";
import {requiresAdmin, requiresStandardOrAdmin} from "./routes/authorization";
import {GenericRouter} from "./routes/generic.router";
import {UserController} from "./controllers/user.controller";
import {TemperatureDeviceController} from "./controllers/temperature-device.controller";
import {GenericDataRouter} from "./routes/generic-data.router";
import {TemperatureDataController} from "./controllers/temperature-data.controller";
import {HumidityDataController} from "./controllers/humidity-data.controller";
import {HumidityDeviceController} from "./controllers/humidity-device.controller";
import {BlindsDeviceController} from "./controllers/blinds-device.controller";
import {BlindsDataController} from "./controllers/blinds-data.controller";
import {BlindsCommandRouter} from "./routes/blinds-command.router";
var socketioJwt = require("socketio-jwt");

declare var process: any, __dirname: any;

class Server {
  public app: express.Express;
  private server: any;
  private io: SocketIO.Server;
  private root: string;
  private port: number;
  private host: string;

  // Bootstrap the application.
  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    // Create expressjs application
    this.app = express();

    // Configure application
    this.config();

    // Setup routes
    this.routes();

    // Create server
    this.server = http.createServer(this.app);

    // Create database connections
    this.databases();

    // Handle websockets
    this.sockets();

    // Start listening
    this.listen();
  }

  private config(): void {
    this.port = process.env.PORT || 3001;
    this.root = path.join(__dirname);
    this.host = 'localhost';
  }

  private routes(): void {
    this.app.use(log4js.connectLogger(logger, {
      level: 'trace',
      format: 'express --> :method :url :status :req[Accept] :res[Content-Type]'
    }));
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(this.inputLogger);

    this.app.use('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
      next();
    });

    this.app.use('/about', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Homeautomation Project by D.Leuenberger and St.Keel');
    });

    this.app.use(authenticationRoute);
    this.app.use('/api/users', requiresAdmin, GenericRouter.create(new UserController()));

    this.app.use('/api/devices/blinds', requiresAdmin, GenericRouter.create(new BlindsDeviceController()));
    this.app.use('/api/devices/humidity', requiresAdmin, GenericRouter.create(new HumidityDeviceController()));
    this.app.use('/api/devices/temperature', requiresAdmin, GenericRouter.create(new TemperatureDeviceController()));

    this.app.use('/api/data/blinds', requiresAdmin, GenericDataRouter.create(new BlindsDataController()));
    this.app.use('/api/data/humidity', requiresAdmin, GenericDataRouter.create(new HumidityDataController()));
    this.app.use('/api/data/temperature', requiresAdmin, GenericDataRouter.create(new TemperatureDataController()));

    this.app.use('/api/command/blinds', requiresStandardOrAdmin, BlindsCommandRouter.create());

    this.app.use('/api', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      next(createError(404, `No route found for ${req.method} ${req.url}`));
    });

    this.app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
      res.sendFile(__dirname + '/public/index.html');
    });

    this.app.use(this.outputLogger);
    this.app.use(this.errorHandler);
  }

  // Configure databases
  private databases(): void {
    DBService.init('localhost');
  }

  // Configure sockets
  private sockets(): void {
    // Get socket.io handle
    this.io = socketIo(this.server);
    this.io.use(socketioJwt.authorize({
      secret: 'secret',
      handshake: true
    }));

    let tempSocket1 = new GenericDataSocket<ITemperatureData>(this.io, "temperature", "1");
    new GenericDataGenerator<ITemperatureData>(tempSocket1, n => {
      return {value: n, timestamp: Date.now(),}
    });
  }

  // Start HTTP server listening
  private listen(): void {
    this.server.listen(this.port);

    //add error handler
    this.server.on("error", function (error: Error) {
      logger.error(`ERROR: ${error.stack}`);
    });

    //start listening on port
    this.server.on("listening", () => {
      logger.info(`Homeautomation server running at http://${this.host}:${this.port}/`);
    });

  }

  private errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.error(`ErrorHandler: ${err.stack}`);
    res.status(500).send(err.message);
  }

  private inputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.debug(`Request: ${req.method} ${req.url}`);
    next();
  }

  private outputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.debug(`Response with status code: ${res.statusCode}`);
    next();
  }
}

// Bootstrap the server
export = Server.bootstrap().app;
