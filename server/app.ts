import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as createError from "http-errors";
import * as log4js from "log4js";
import {getLogger, Logger} from "./utils/logger";
import {getAuthenticationRoute} from "./routes/authentication";
import {DBService} from "./models/db.service";
import * as http from "http";
import * as path from "path";
import * as socketIo from "socket.io";
import {
  requiresAdmin,
  requiresAdminExceptForGet,
  requiresAuthenticatedUser,
  requiresStandardOrAdmin
} from "./routes/authorization";
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
import {SocketService} from "./socket/socket-service";
import {Engine} from "./logic/engine";
import {Info} from "./entities/info";
import {initAdmin} from "./models/user.model";
import {JwtConfiguration} from "./utils/jwt-configuration";

const LOGGER: Logger = getLogger('Server');
const VERSION: string = '1.0.0';
const ABOUT: string = `Homeautomation V${VERSION} von D.Leuenberger und St.Keel`;

var socketioJwt = require('socketio-jwt');

declare var process: any, __dirname: any;

const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  {name: 'admin', alias: 'a', type: String},
  {name: 'db', alias: 'd', type: String},
  {name: 'help', alias: 'h', type: Boolean},
  {name: 'production', alias: 'p', type: Boolean},
];

class Server {
  public app: express.Express;
  private server: any;
  private io: SocketIO.Server;
  private root: string;
  private port: number;
  private host: string;
  private env: string;
  private socketService: SocketService;
  private engine: Engine;
  private jwtConfig: JwtConfiguration;

  // Bootstrap the application.
  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    const options = commandLineArgs(optionDefinitions);
    if (options.help) {
      console.log(
        'Homeautomation Commandline Help\n' +
        '-h, --help            show this help\n' +
        '-a, --admin password  create admin user with the given password\n' +
        '-d, --db db-location  DB to use. Either of [mlab | IP-address | hostname | locahost],\n' +
        '                      default is localhost\n' +
        '-p, --production      use for production');
      process.exit(0);
    }

    // Create expressjs application
    this.app = express();
    this.app.use(compression());

    // Configure application
    this.config(options.production);

    // create ClientSocketService
    this.socketService = new SocketService();

    // Create database connections
    this.databases(options.db);

    // Start the hardware controller engine
    this.engine = new Engine();

    // Setup routes
    this.routes();

    // Create server
    this.server = http.createServer(this.app);

    // Handle websockets
    this.sockets();

    // Start listening
    this.listen();

    if (options.admin) {
      initAdmin(options.admin);
    }
  }

  private config(prod: boolean): void {
    this.port = process.env.PORT || 3001;
    this.root = path.join(__dirname);
    this.host = 'localhost';
    this.env = prod ? 'production' : (process.env.NODE_ENV || 'development');

    this.jwtConfig = new JwtConfiguration(this.env);
    if (this.env === "production") {
      this.jwtConfig.initProd('../../ha-key', '../../ha-key.pub');
      LOGGER.info(`PRODUCTION-MODE, use private/public keys.`);
    } else {
      LOGGER.info(`DEVELOPMENT-MODE, use shared secret.`);
    }
  }

  private routes(): void {
    this.app.use(log4js.connectLogger(LOGGER, {
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
      res.send(ABOUT);
    });

    this.app.use(getAuthenticationRoute(this.jwtConfig));
    this.app.use('/api/users', requiresAdmin, GenericRouter.create(new UserController(this.socketService)));

    // blinds devices
    let blindsDeviceController: BlindsDeviceController = new BlindsDeviceController(this.socketService);
    this.engine.registerBlindsDeviceController(blindsDeviceController);
    this.app.use('/api/devices/blinds', requiresAdminExceptForGet, GenericRouter.create(blindsDeviceController));

    // humidity devices
    let humidityDeviceController: HumidityDeviceController = new HumidityDeviceController(this.socketService);
    this.engine.registerHumidityDeviceController(humidityDeviceController);
    this.app.use('/api/devices/humidity', requiresAdminExceptForGet, GenericRouter.create(humidityDeviceController));

    // temperature devices
    let temperatureDeviceController: TemperatureDeviceController = new TemperatureDeviceController(this.socketService);
    this.engine.registerTemperatureDeviceController(temperatureDeviceController);
    this.app.use('/api/devices/temperature', requiresAdminExceptForGet, GenericRouter.create(temperatureDeviceController));

    // data handling for all devices
    this.app.use('/api/data/blinds', requiresAuthenticatedUser, GenericDataRouter.create(new BlindsDataController(this.socketService)));
    this.app.use('/api/data/humidity', requiresAuthenticatedUser, GenericDataRouter.create(new HumidityDataController(this.socketService)));
    this.app.use('/api/data/temperature', requiresAuthenticatedUser, GenericDataRouter.create(new TemperatureDataController(this.socketService)));

    // blinds device command handling
    this.app.use('/api/command/blinds', requiresStandardOrAdmin, BlindsCommandRouter.create(this.engine));

    this.app.use('/api/info', requiresAuthenticatedUser, function (req: express.Request, res: express.Response, next: express.NextFunction) {
      let info = new Info(ABOUT, process.version);
      res.send(info);
    });

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
  private databases(option: string): void {
    DBService.init(option);
  }

  // Configure sockets
  private sockets(): void {
    // Get socket.io handle
    this.io = socketIo(this.server);
    this.io.use(socketioJwt.authorize({
      secret: this.jwtConfig.getVerifySecret(),
      handshake: true
    }));

    this.socketService.init(this.io);
  }

  // Start HTTP server listening
  private listen(): void {
    this.server.listen(this.port);

    //add error handler
    this.server.on('error', function (error: Error) {
      LOGGER.error(`ERROR: ${error.stack}`);
    });

    //start listening on port
    this.server.on('listening', () => {
      LOGGER.info(`Homeautomation server running at http://${this.host}:${this.port}/`);
    });

  }

  private errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.error(`ErrorHandler: ${err.stack}`);
    res.status(500).send(err.message);
  }

  private inputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.debug(`Request: ${req.method} ${req.url}`);
    next();
  }

  private outputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.debug(`Response with status code: ${res.statusCode}`);
    next();
  }
}

// Bootstrap the server
export = Server.bootstrap().app;
