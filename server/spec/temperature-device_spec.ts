'use strict';

import {logger} from '../utils/logger';
import {v4} from 'uuid';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {ITemperatureDevice} from '../entities/device.interface';
import {Port} from '../hardware/port-map';
import {loginOptions, authBearerOptions} from './httpOptions';
import {RequestContainer, ResponseContainer} from '../wire/com-container';

describe('Temperature-Device Test', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/devices/temperature';
  const TEST_TEMPERATURE_DEVICE = 'Test Temperature 99';

  let request = require('request');
  let adminToken: string;
  let testTemperatureDeviceId: any;
  let clientCtx: string = v4();

  logger.debug(`clientCtx: ${clientCtx}`);

  describe('POST ' + TEST_URL, function () {
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

    let testTemperatureDevice: ITemperatureDevice = {
      name: TEST_TEMPERATURE_DEVICE,
      port: Port.AI_1,
    };
    let requestContent: RequestContainer<ITemperatureDevice> = new RequestContainer<ITemperatureDevice>(clientCtx, testTemperatureDevice);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 201 - temperature-device created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          logger.debug(`Temperature-device created (body): ${body}`);
          expect(response.statusCode).toBe(201);
          logger.debug(`Temperature-device created (body): ${body}`);
          let responseContent: ResponseContainer<ITemperatureDevice> = JSON.parse(body);
          logger.debug(`Temperature-device created: ${JSON.stringify(responseContent.content)}`);
          testTemperatureDeviceId = responseContent.content.id;
          logger.debug(`testDeviceId: ${testTemperatureDeviceId}`);
          done();
        });
    });
    it('returns status code 500 - temperature-device already exists', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          done();
        });
    });
  });

  describe('GET ' + TEST_URL + '/' + testTemperatureDeviceId, function () {
    it('returns status code 200 - found temperature-device', function (done) {
      request.get(TEST_URL + '/' + testTemperatureDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<ITemperatureDevice> = JSON.parse(body);
          logger.debug(`Temperature-device retrieved: ${JSON.stringify(responseContent)}`);
          expect(responseContent.content.name).toBe(TEST_TEMPERATURE_DEVICE);
          done();
        });
    });
  });

  describe('PUT ' + TEST_URL + '/' + testTemperatureDeviceId, function () {
    let NAME: string = 'Test Temperature-Device 007';
    let testTemperatureDevice: ITemperatureDevice = {
      id: testTemperatureDeviceId,
      name: NAME,
      port: Port.AI_1,
    };
    let requestContent: RequestContainer<ITemperatureDevice> = new RequestContainer<ITemperatureDevice>(clientCtx, testTemperatureDevice);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 200 - temperature-device updated', function (done) {
      request.put(TEST_URL + '/' + testTemperatureDeviceId,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<ITemperatureDevice> = JSON.parse(body);
          logger.debug(`Temperature-device updated: ${JSON.stringify(responseContent)}`);
          expect(responseContent.content.name).toBe(NAME);
          done();
        });
    });
  });

  describe('DELETE ' + TEST_URL + '/' + testTemperatureDeviceId, function () {
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
      logger.error(`AfterAll: test temperature-device with id ${testTemperatureDeviceId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
