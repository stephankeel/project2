import {Logger, getLogger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IAnalogDevice} from '../entities/device.interface';
import {Port} from '../hardware/port-map';
import {loginOptions, authBearerOptions} from './httpOptions';

const LOGGER: Logger = getLogger('temperature_device_spec');

describe('REST API Roundtrip Test of Temperature-Device', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/devices/temperature';
  const TEST_TEMPERATURE_DEVICE = 'Test Temperature 99';

  let request = require('request');
  let adminToken: string;
  let testTemperatureDeviceId: any;

  describe('Test login and creation of a temperature-device', function () {
    it('returns status code 200 - successfull authentication', function (done) {
      request.post(LOGIN_URL,
        loginOptions('admin', '12345678'),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let authData = JSON.parse(body);
          adminToken = authData.token;
          LOGGER.debug(`admin-token: ${adminToken}`);
          done();
        });
    });

    let testTemperatureDevice: IAnalogDevice = {
      name: TEST_TEMPERATURE_DEVICE,
      port: Port.AI_1,
      pollingInterval: 10
    };
    LOGGER.debug(`request: ${JSON.stringify(testTemperatureDevice)}`);
    it('returns status code 201 - temperature-device created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testTemperatureDevice)),
        function (error: any, response: RequestResponse, body: any) {
          LOGGER.debug(`Temperature-device created (body): ${JSON.stringify(body)}`);
          expect(response.statusCode).toBe(201);
          let testTemperatureDevice: IAnalogDevice = JSON.parse(body);
          LOGGER.debug(`Temperature-device created: ${JSON.stringify(testTemperatureDevice)}`);
          testTemperatureDeviceId = testTemperatureDevice.id;
          LOGGER.debug(`testDeviceId: ${testTemperatureDeviceId}`);
          done();
        });
    });
    it('returns status code 500 - temperature-device already exists', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testTemperatureDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          done();
        });
    });
  });

  describe('Test get dedicated temperature-device', function () {
    it('returns status code 200 - found temperature-device', function (done) {
      request.get(TEST_URL + '/' + testTemperatureDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let temperatureDevice: IAnalogDevice = JSON.parse(body);
          LOGGER.debug(`Temperature-device retrieved: ${JSON.stringify(temperatureDevice)}`);
          expect(temperatureDevice.name).toBe(TEST_TEMPERATURE_DEVICE);
          done();
        });
    });
  });

  describe('Test update of a temperature-device', function () {
    let NAME: string = 'Test Temp.Dev 007';
    let testTemperatureDevice: IAnalogDevice = {
      id: testTemperatureDeviceId,
      name: NAME,
      port: Port.AI_1,
      pollingInterval: 10
    };
    LOGGER.debug(`request: ${JSON.stringify(testTemperatureDevice)}`);
    it('returns status code 200 - temperature-device updated', function (done) {
      request.put(TEST_URL + '/' + testTemperatureDeviceId,
        authBearerOptions(adminToken, JSON.stringify(testTemperatureDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let temperatureDevice: IAnalogDevice = JSON.parse(body);
          LOGGER.debug(`Temperature-device updated: ${JSON.stringify(temperatureDevice)}`);
          expect(temperatureDevice.name).toBe(NAME);
          done();
        });
    });
  });

  describe('Test deletion of a temperature-device', function () {
    it('returns status code 200 - temperature-device deleted', function (done) {
      request.delete(TEST_URL + '/' + testTemperatureDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(body)).toBe(testTemperatureDeviceId);
          testTemperatureDeviceId = null;
          done();
        });
    });
  });

  afterAll(function () {
    if (testTemperatureDeviceId) {
      LOGGER.error(`AfterAll: test temperature-device with id ${testTemperatureDeviceId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
