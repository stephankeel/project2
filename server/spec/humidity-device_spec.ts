'use strict';

import {logger} from '../utils/logger';
import {v4} from 'uuid';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IHumidityDevice} from '../entities/device.interface';
import {Port} from '../hardware/port-map';
import {loginOptions, authBearerOptions} from './httpOptions';
import {RequestContainer, ResponseContainer} from '../wire/com-container';

describe('Humidity-Device Test', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/devices/humidity';
  const TEST_HUMIDITY_DEVICE = 'Test Humidity 99';

  let request = require('request');
  let adminToken: string;
  let testHumidityDeviceId: any;
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

    let testHumidityDevice: IHumidityDevice = {
      name: TEST_HUMIDITY_DEVICE,
      port: Port.AI_1,
    };
    let requestContent: RequestContainer<IHumidityDevice> = new RequestContainer<IHumidityDevice>(clientCtx, testHumidityDevice);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 201 - humidity-device created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          logger.debug(`Humidity-device created (body): ${body}`);
          expect(response.statusCode).toBe(201);
          logger.debug(`Humidity-device created (body): ${body}`);
          let responseContent: ResponseContainer<IHumidityDevice> = JSON.parse(body);
          logger.debug(`Humidity-device created: ${JSON.stringify(responseContent.content)}`);
          testHumidityDeviceId = responseContent.content.id;
          logger.debug(`testDeviceId: ${testHumidityDeviceId}`);
          done();
        });
    });
    it('returns status code 500 - humidity-device already exists', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          done();
        });
    });
  });

  describe('GET ' + TEST_URL + '/' + testHumidityDeviceId, function () {
    it('returns status code 200 - found humidity-device', function (done) {
      request.get(TEST_URL + '/' + testHumidityDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<IHumidityDevice> = JSON.parse(body);
          logger.debug(`Humidity-device retrieved: ${JSON.stringify(responseContent)}`);
          expect(responseContent.content.name).toBe(TEST_HUMIDITY_DEVICE);
          done();
        });
    });
  });

  describe('PUT ' + TEST_URL + '/' + testHumidityDeviceId, function () {
    let NAME: string = 'Test Humidity-Device 007';
    let testHumidityDevice: IHumidityDevice = {
      id: testHumidityDeviceId,
      name: NAME,
      port: Port.AI_1,
    };
    let requestContent: RequestContainer<IHumidityDevice> = new RequestContainer<IHumidityDevice>(clientCtx, testHumidityDevice);
    logger.debug(`requestContent: ${JSON.stringify(requestContent)}`);
    it('returns status code 200 - humidity-device updated', function (done) {
      request.put(TEST_URL + '/' + testHumidityDeviceId,
        authBearerOptions(adminToken, JSON.stringify(requestContent)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let responseContent: ResponseContainer<IHumidityDevice> = JSON.parse(body);
          logger.debug(`Humidity-device updated: ${JSON.stringify(responseContent)}`);
          expect(responseContent.content.name).toBe(NAME);
          done();
        });
    });
  });

  describe('DELETE ' + TEST_URL + '/' + testHumidityDeviceId, function () {
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
      logger.error(`AfterAll: test humidity-device with id ${testHumidityDeviceId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
