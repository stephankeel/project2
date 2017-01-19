'use strict';

import {logger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IBlindsDevice} from '../entities/device.interface';
import {Port, digitalInputs, digitalOutputs, analogInputs} from '../hardware/port-map';
import {loginOptions, authBearerOptions} from './httpOptions';


describe('Blinds-Device Test', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/devices/blinds';
  const TEST_BLINDS_DEVICE = 'Test Blinds 99';

  let request = require('request');
  let adminToken: string;
  let testBlindsDeviceId: any;

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

    let testBlindsDevice: IBlindsDevice = {
      name: TEST_BLINDS_DEVICE,
      keyUp: Port.DI_1,
      keyDown: Port.DI_2,
      actorUp: Port.DO_1,
      actorDown: Port.DO_2,
      runningSeconds: 60,
    };
    it('returns status code 201 - blinds-device created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testBlindsDevice)),
        function (error: any, response: RequestResponse, body: any) {
          logger.debug(`Blind-device created (body): ${body}`);
          expect(response.statusCode).toBe(201);
          logger.debug(`Blinds-device created (body): ${body}`);
          let device: IBlindsDevice = JSON.parse(body).data;
          logger.debug(`Blinds-device created: ${JSON.stringify(device)}`);
          testBlindsDeviceId = device.id;
          logger.debug(`testDeviceId: ${testBlindsDeviceId}`);
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

  describe('GET ' + TEST_URL + '/' + testBlindsDeviceId, function () {
    it('returns status code 200 - found blinds-device', function (done) {
      request.get(TEST_URL + '/' + testBlindsDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let testBlindsDevice: IBlindsDevice = JSON.parse(body).data;
          logger.debug(`Blinds-device retrieved: ${JSON.stringify(testBlindsDevice)}`);
          expect(testBlindsDevice.name).toBe(TEST_BLINDS_DEVICE);
          done();
        });
    });
  });

  describe('PUT ' + TEST_URL + '/' + testBlindsDeviceId, function () {
    let NAME: string = 'Test Blinds-Device 007';
    let testBlindsDevice: IBlindsDevice = {
      id: testBlindsDeviceId,
      name: NAME,
      keyUp: Port.DI_1,
      keyDown: Port.DI_2,
      actorUp: Port.DO_1,
      actorDown: Port.DO_2,
      runningSeconds: 60,
    };
    it('returns status code 200 - blinds-device updated', function (done) {
      request.put(TEST_URL + '/' + testBlindsDeviceId,
        authBearerOptions(adminToken, JSON.stringify(testBlindsDevice)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let blindsDevice: IBlindsDevice = JSON.parse(body).data;
          logger.debug(`Blinds-device updated: ${JSON.stringify(blindsDevice)}`);
          expect(blindsDevice.name).toBe(NAME);
          done();
        });
    });
  });

  describe('DELETE ' + TEST_URL + '/' + testBlindsDeviceId, function () {
    it('returns status code 200 - blinds-device deleted', function (done) {
      request.delete(TEST_URL + '/' + testBlindsDeviceId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          testBlindsDeviceId = null;
          done();
        });
    });
  });

  afterAll(function () {
    if (testBlindsDeviceId) {
      logger.error(`AfterAll: test blinds-device with id ${testBlindsDeviceId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
