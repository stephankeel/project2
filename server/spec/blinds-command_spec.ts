import {Logger, getLogger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {loginOptions, authBearerOptions} from './httpOptions';

const LOGGER: Logger = getLogger('blinds_command_spec');

describe('REST API Roundtrip Test of Blinds-Command', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/command/blinds';

  let request = require('request');
  let adminToken: string;
  let testBlindsDeviceId: any = '000000000000000007'; // TODO: use available blinds-device

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
  });

  describe(`Test closing blinds`, function () {
    it('returns status code 200 - blinds-command executed', function (done) {
      request.put(`${TEST_URL}/${testBlindsDeviceId}/close`,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: string = JSON.parse(body);
          LOGGER.debug(`Blinds-command executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  describe(`Test sopping blinds`, function () {
    it('returns status code 200 - blinds-command executed', function (done) {
      request.put(`${TEST_URL}/${testBlindsDeviceId}/stop`,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: string = JSON.parse(body);
          LOGGER.debug(`Blinds-command executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  describe(`Test opening blinds`, function () {
    it('returns status code 200 - blinds-command executed', function (done) {
      request.put(`${TEST_URL}/${testBlindsDeviceId}/open`,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: string = JSON.parse(body);
          LOGGER.debug(`Blinds-command executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });
});
