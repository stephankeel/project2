'use strict';

import {RequestResponse} from 'request';
import {BASE_URL} from './constants';

let request = require('request');
let adminToken: string;

describe('Initial Authentication Test', function () {
    const TEST_URL = BASE_URL + 'api/authenticate';
    describe('POST ' + TEST_URL, function () {
        it('returns status code 200 - successfull authentication', function (done) {
            request.post(TEST_URL, {
                'content-type': 'application/json',
                form: {username: 'admin', password: '123456'}
            }, function(error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                let authData = JSON.parse(body);
                adminToken = authData.token;
                console.log(`admin-token: ${adminToken}`);
                done();
            });
        });
        it('returns status code 401 -  wrong password', function (done) {
            let username: string = 'admin';
            request.post(TEST_URL, {
                'content-type': 'application/json',
                form: {username: username, password: 'xxxxxx'}
            }, function(error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(401);
                expect(body).toContain(`user ${username} wrong password`);
                done();
            });
        });
        it('returns status code 401 -  wrong password', function (done) {
            let username: string = 'muster';
            request.post(TEST_URL, {
                'content-type': 'application/json',
                form: {username: username, password: 'xxxxxx'}
            }, function(error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(401);
                expect(body).toContain(`user ${username} unknown`);
                done();
            });
        });
    });
});

describe('Token-based Authentication Test', function () {
    const TEST_URL = BASE_URL + 'api/authenticated';
    describe('GET ' + TEST_URL, function () {
        it('returns status code 200 - valid token provided', function (done) {
            request.get(TEST_URL, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                expect(body).toContain(`token is valid`);
                done();
            });
        });
        it('returns status code 401 - not yet authenticated', function (done) {
            request.get(TEST_URL, {
                headers: {
                    'Authorization': 'any-bla-bla',
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(401);
                expect(body).toContain('token is not');
                done();
            });
        });
    });
});
