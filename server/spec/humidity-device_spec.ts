import {Logger, getLogger} from '../utils/logger';
import {v4} from 'uuid';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IHumidityDevice} from '../entities/device.interface';
import {Port} from '../hardware/port-map';
import {loginOptions, authBearerOptions} from './httpOptions';

const LOGGER: Logger = getLogger('humidity_device_spec');

describe('REST API Roundtrip Test of Humidity-Device', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/devices/humidity';
  const TEST_HUMIDITY_DEVICE = 'Test Humidity 99';

  let request = require('request');
  let adminToken: string;
  let testHumidityDeviceId: any;
  let clientCtx: string = v4();

  LOGGER.debug(`clientCtx: ${clientCtx}`);

  describe('Test login and creation of a humidity-device', function () {
    it('returns status code 200 - successfull authentication', function (done) {
      request.post(LOGIN_URL,
        loginOptions('admin', '123456'),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let authData = JSON.parse(body);
          adminToken = authData.token;
          LOGGER.debug(`admin-token: ${adminToken}`);
          done();
        });
    });

    let testHumidityDevice: IHumidityDevice = {
      name: TEST_HUMIDITY_DEVICE,
      port: Port.AI_1,
    };
    LOGGER.debug(`requestContent: ${JSON.stringify(testHumidityDevice)}`);
    it('returns status code 201 - humidity-device created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testHumidityDevice)),
        function (error: any, response: RequestResponse, body: any) {
          LOGGER.debug(`Humidity-device created (body): ${JSON.stringify(body)}`);
          expect(response.statusCode).toBe(201);
          let humidityDevice: IHumidityDevice = JSON.parse(body);
          LOGGER.debug(`Humidity-device created: ${JSON.stringify(humidityDevice)}`);
          testHumidityDeviceId = humidityDevice.id;
          LOGGER.debug(`testDeviceId: ${testHumidityDeviceId}`);
          done();
        });
    });
    it('returns status code 500 - humidity-device already exists', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testHumidityDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          done();
        });
    });
  });

  describe('Test get dedicated humidity-device', function () {
    it('returns status code 200 - found humidity-device', function (done) {
      request.get(TEST_URL + '/' + testHumidityDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let humidityDevice: IHumidityDevice = JSON.parse(body);
          LOGGER.debug(`Humidity-device retrieved: ${JSON.stringify(humidityDevice)}`);
          expect(humidityDevice.name).toBe(TEST_HUMIDITY_DEVICE);
          done();
        });
    });
  });

  describe('Test update of a humidity-device', function () {
    let NAME: string = 'Test Humidity-Device 007';
    let testHumidityDevice: IHumidityDevice = {
      id: testHumidityDeviceId,
      name: NAME,
      port: Port.AI_1,
    };
    LOGGER.debug(`requestContent: ${JSON.stringify(testHumidityDevice)}`);
    it('returns status code 200 - humidity-device updated', function (done) {
      request.put(TEST_URL + '/' + testHumidityDeviceId,
        authBearerOptions(adminToken, JSON.stringify(testHumidityDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let humidityDevice: IHumidityDevice = JSON.parse(body);
          LOGGER.debug(`Humidity-device updated: ${JSON.stringify(humidityDevice)}`);
          expect(humidityDevice.name).toBe(NAME);
          done();
        });
    });
  });

  describe('Test deletion of a humidity-device', function () {
    it('returns status code 200 - humidity-device deleted', function (done) {
      request.delete(TEST_URL + '/' + testHumidityDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(body)).toBe(testHumidityDeviceId);
          testHumidityDeviceId = null;
          done();
        });
    });
  });

  afterAll(function () {
    if (testHumidityDeviceId) {
      LOGGER.error(`AfterAll: test humidity-device with id ${testHumidityDeviceId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
