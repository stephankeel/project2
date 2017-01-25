'use strict';

import {logger} from '../utils/logger';
import {v4} from 'uuid';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {loginOptions, authBearerOptions} from './httpOptions';
import {RequestContainer, ResponseContainer} from '../wire/com-container';

describe('REST API Roundtrip Test of Blinds-Command', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/command/blinds';

  let request = require('request');
  let adminToken: string;
  let clientCtx: string = v4();
  let testBlindsDeviceId: any = '000000000000000007'; // TODO: use available blinds-device

  logger.debug(`clientCtx: ${clientCtx}`);

  describe('Test login', function () {
    it('returns status code 200 - successfull authentication', function (done) {
      request.post(LOGIN_URL,
        loginOptions('admin', '123456'),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let authData = JSON.parse(body);
          adminToken = authData.token;
          logger.debug(`admin-token: ${adminToken}`);
          done();
        });
    });
  });

  describe(`Test closing blinds`, function () {
    let requestContent: RequestContainer<any> = new RequestContainer<any>(clientCtx, null);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 200 - blinds-command executed', function (done) {
      request.put(`${TEST_URL}/${testBlindsDeviceId}/close`,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<string> = JSON.parse(body);
          logger.debug(`Blinds-command executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  describe(`Test sopping blinds`, function () {
    let requestContent: RequestContainer<any> = new RequestContainer<any>(clientCtx, null);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 200 - blinds-command executed', function (done) {
      request.put(`${TEST_URL}/${testBlindsDeviceId}/stop`,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<string> = JSON.parse(body);
          logger.debug(`Blinds-command executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });

  describe(`Test opening blinds`, function () {
    let requestContent: RequestContainer<any> = new RequestContainer<any>(clientCtx, null);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 200 - blinds-command executed', function (done) {
      request.put(`${TEST_URL}/${testBlindsDeviceId}/open`,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<string> = JSON.parse(body);
          logger.debug(`Blinds-command executed: ${JSON.stringify(responseContent)}`);
          done();
        });
    });
  });


});
