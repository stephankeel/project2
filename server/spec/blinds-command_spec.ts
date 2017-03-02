import {Logger, getLogger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {loginOptions, authBearerOptions} from './httpOptions';
import {IBlindsDevice} from '../entities/device.interface';
import {IBlindsCommand} from '../entities/blinds-command.interface'
import {BlindsAction} from '../entities/blinds-action'
import {Port} from '../hardware/port-map';

const LOGGER: Logger = getLogger('blinds_command_spec');

describe('REST API Roundtrip Test of Blinds-Command', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_MANAGE_URL = BASE_URL + 'api/devices/blinds';
  const TEST_URL = BASE_URL + 'api/command/blinds';

  let request = require('request');
  let adminToken: string;
  let testBlindsDeviceId: any;

  describe('Test login', function () {
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

    let testBlindsDevice: IBlindsDevice = {
      name: 'Blinds for testing commands',
      keyUp: Port.DI_1,
      keyDown: Port.DI_2,
      actorUp: Port.DO_1,
      actorDown: Port.DO_2,
      runningSeconds: 60
    };
    LOGGER.debug(`requestContent: ${JSON.stringify(testBlindsDevice)}`);
    it('returns status code 201 - blinds-device created', function (done) {
      request.post(TEST_MANAGE_URL,
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

  });

  describe(`Test closing blinds`, function () {
    it('returns status code 200 - blinds-command closing executed', function (done) {
      let command: IBlindsCommand = {id: testBlindsDeviceId, action: BlindsAction.CLOSE};
      request.put(`${TEST_URL}`,
        authBearerOptions(adminToken, JSON.stringify(command)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: string = JSON.parse(body);
          LOGGER.debug(`Blinds-command closing executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  describe(`Test opening blinds`, function () {
    it('returns status code 200 - blinds-command opening executed', function (done) {
      let command: IBlindsCommand = {id: testBlindsDeviceId, action: BlindsAction.OPEN};
      request.put(`${TEST_URL}`,
        authBearerOptions(adminToken, JSON.stringify(command)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: string = JSON.parse(body);
          LOGGER.debug(`Blinds-command opening executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  describe(`Test stopping blinds`, function () {
    it('returns status code 200 - blinds-command stop executed', function (done) {
      let command: IBlindsCommand = {id: testBlindsDeviceId, action: BlindsAction.STOP};
      request.put(`${TEST_URL}`,
        authBearerOptions(adminToken, JSON.stringify(command)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: string = JSON.parse(body);
          LOGGER.debug(`Blinds-command stop executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  afterAll(function () {
    request.delete(TEST_MANAGE_URL + '/' + testBlindsDeviceId,
      authBearerOptions(adminToken),
      function (error: any, response: RequestResponse, body: any) {
        if (error) {
          LOGGER.error(`AfterAll: test blinds-device with id ${testBlindsDeviceId} has not been deleted. Please clean it from the database manually.`);
        }
      });
  });

});
