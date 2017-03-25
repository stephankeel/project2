import {Logger, getLogger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IBlindsDevice} from '../entities/device.interface';
import {Port} from '../hardware/port-map';
import {loginOptions, authBearerOptions} from './httpOptions';

const LOGGER: Logger = getLogger('blinds_device_spec');

describe('REST API Roundtrip Test of Blinds-Device', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/devices/blinds';
  const TEST_BLINDS_DEVICE = 'Test Blinds 99';

  let request = require('request');
  let adminToken: string;
  let testBlindsDeviceId: any;


  describe('Test login, adding a blinds-device and duplicate rejection', function () {
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

    let testBlindsDevice: IBlindsDevice = {
      name: TEST_BLINDS_DEVICE,
      keyUp: Port.DI_1,
      keyDown: Port.DI_2,
      actorUp: Port.DO_1,
      actorDown: Port.DO_2,
      runningSeconds: 60
    };
    LOGGER.debug(`requestContent: ${JSON.stringify(testBlindsDevice)}`);
    it('returns status code 201 - blinds-device created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testBlindsDevice)),
        function (error: any, response: RequestResponse, body: any) {
          LOGGER.debug(`Blinds-device created (body): ${JSON.stringify(body)}`);
          expect(response.statusCode).toBe(201);
          let blindsDevice: IBlindsDevice = JSON.parse(body);
          LOGGER.debug(`Blinds-device created: ${JSON.stringify(blindsDevice)}`);
          testBlindsDeviceId = blindsDevice.id;
          LOGGER.debug(`testDeviceId: ${testBlindsDeviceId}`);
          done();
        });
    });
    it('returns status code 500 - blinds-device already exists', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testBlindsDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          done();
        });
    });
  });

  describe('Test get dedicated blinds-device', function () {
    it('returns status code 200 - found blinds-device', function (done) {
      request.get(TEST_URL + '/' + testBlindsDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let blindsDevice: IBlindsDevice = JSON.parse(body);
          LOGGER.debug(`Blinds-device retrieved: ${JSON.stringify(blindsDevice)}`);
          expect(blindsDevice.name).toBe(TEST_BLINDS_DEVICE);
          done();
        });
    });
  });

  describe('Test get all blinds-devices', function () {
    it('returns status code 200 - found blinds-devices', function (done) {
      request.get(TEST_URL,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let blindsDevices: IBlindsDevice[] = JSON.parse(body);
          LOGGER.debug(`Blinds-device retrieved: ${JSON.stringify(blindsDevices)}`);
          expect(blindsDevices[0].name).toBe(TEST_BLINDS_DEVICE);
          done();
        });
    });
  });

  describe('Test update of a  blinds-device', function () {
    let NAME: string = 'Test Blinds-Dev 007';
    let testBlindsDevice: IBlindsDevice = {
      id: testBlindsDeviceId,
      name: NAME,
      keyUp: Port.DI_1,
      keyDown: Port.DI_2,
      actorUp: Port.DO_1,
      actorDown: Port.DO_2,
      runningSeconds: 60
    };
    LOGGER.debug(`requestContent: ${JSON.stringify(testBlindsDevice)}`);
    it('returns status code 200 - blinds-device updated', function (done) {
      request.put(TEST_URL + '/' + testBlindsDeviceId,
        authBearerOptions(adminToken, JSON.stringify(testBlindsDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let blindsDevice: IBlindsDevice = JSON.parse(body);
          LOGGER.debug(`Blinds-device updated: ${JSON.stringify(blindsDevice)}`);
          expect(blindsDevice.name).toBe(NAME);
          done();
        });
    });
  });

  describe('Test deletion of a blinds-device', function () {
    it('returns status code 200 - blinds-device deleted', function (done) {
      request.delete(TEST_URL + '/' + testBlindsDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(body)).toBe(testBlindsDeviceId);
          testBlindsDeviceId = null;
          done();
        });
    });
  });

  afterAll(function () {
    if (testBlindsDeviceId) {
      LOGGER.error(`AfterAll: test blinds-device with id ${testBlindsDeviceId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
