'use strict';

import {logger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IUser} from '../entities/user.interface';

let request = require('request');
let adminToken: string;

describe('User Test', function () {
    const LOGIN_URL = BASE_URL + 'api/authenticate';
    const TEST_URL = BASE_URL + 'api/users';
    describe('GET ' + TEST_URL, function () {
        it('returns status code 401 - not yet authenticated', function (done) {
            request.get(TEST_URL, {
                headers: {
                    'Authorization': '',
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(401);
                expect(body).toContain('not yet authenticated');
                done();
            });
        });
        it('returns status code 200 - successfull authentication', function (done) {
            request.post(LOGIN_URL, {
                'content-type': 'application/json',
                form: {username: 'admin', password: '123456'}
            }, function(error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                let authData = JSON.parse(body);
                adminToken = authData.token;
                logger.debug(`admin-token: ${adminToken}`);
                done();
            });
        });
        it('returns status code 200 - found one user', function (done) {
            request.get(TEST_URL, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                logger.debug('Users: ' + JSON.stringify(body));
                let users: IUser[] = JSON.parse(body).data;
                logger.debug('Users: ' + users);
                expect(users.length).toBeGreaterThan(0);
                done();
            });
        });
    });

});
