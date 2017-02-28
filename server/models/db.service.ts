import {Logger, getLogger} from '../utils/logger';
import mongoose = require('mongoose');

const DB_PORT: number = 27017;
const RETRY_SECONDS: number = 5;
const LOGGER: Logger = getLogger('DBService');

/**
 * This singleton class manages the connection to the database and keeps it up and running.
 */
export class DBService {

  private static instance: DBService = new DBService();

  private db: mongoose.Connection = mongoose.connection;
  private dbLocation: any;

  private constructor() {
  }

  public static init(option: string): DBService {
    if (option) {
      option = option.toLowerCase();
      if (option === 'mlab') {
        DBService.instance.dbLocation = 'mongodb://admin:hallihallo62@ds050879.mlab.com:50879/homeautomation';
      } else {
        DBService.instance.dbLocation = `${option}:${DB_PORT}/homeautomation`;
      }
    } else {
      DBService.instance.dbLocation = `localhost:${DB_PORT}/homeautomation`;
    }

    DBService.instance.db
      .once('open', () => LOGGER.info('DB ready'))
      .on('connecting', () => LOGGER.info('DB connecting...'))
      .on('connected', () => LOGGER.info('DB connected'))
      .on('reconnected', () => LOGGER.info('DB reconnected'))
      .on('disconnected', () => LOGGER.info('DB disconnected'))
      .on('error', (error: any) => {
        LOGGER.error('DB connection error', error);
        mongoose.disconnect((err) => {
          if (err) {
            LOGGER.error('mongoose disconnect failed', err);
          }
          DBService.instance.connect(RETRY_SECONDS);
        });
      });

    DBService.instance.connect(0);
    return DBService.instance;
  }

  private connect(delay: number): void {
    LOGGER.info(`Trying to connect the DB ${DBService.instance.dbLocation} in ${delay} seconds ...`);
    setTimeout(() => mongoose.connect(DBService.instance.dbLocation, {server: {auto_reconnect: true}}), delay * 1000);
  }

}
