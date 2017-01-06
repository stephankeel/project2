'use strict';

import {logger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';

describe('User Test', function () {
    const LOGIN_URL = BASE_URL + 'api/authenticate';
    const TEST_URL = BASE_URL + 'api/users';
    const TEST_USERNAME = 'testuser99';

    let request = require('request');
    let adminToken: string;
    let testUserId: any;

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
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                let authData = JSON.parse(body);
                adminToken = authData.token;
                logger.debug(`admin-token: ${adminToken}`);
                done();
            });
        });
        it('returns status code 200 - found some users', function (done) {
            request.get(TEST_URL, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                let users: IUser[] = JSON.parse(body).data;
                logger.debug(`Users: ${users}`);
                expect(users.length).toBeGreaterThan(0);
                done();
            });
        });
    });

    describe('POST ' + TEST_URL, function () {
        let testUser: IUser = {
            firstname: 'Hugo',
            lastname: 'Boss',
            type: UserType.STANDARD,
            username: TEST_USERNAME,
            password: '1234'
        };
        it('returns status code 201 - user created', function (done) {
            request.post(TEST_URL, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testUser)
            }, function (error: any, response: RequestResponse, body: any) {
                logger.debug(`User created (body): ${body}`);
                expect(response.statusCode).toBe(201);
                logger.debug(`User created (body): ${body}`);
                let user: IUser = JSON.parse(body).data;
                logger.debug(`User created: ${JSON.stringify(user)}`);
                testUserId = user.id;
                logger.debug(`testUserId: ${testUserId}`);
                done();
            });
        });
        it('returns status code 500 - user already exists', function (done) {
            request.post(TEST_URL, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testUser)
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(500);
                done();
            });
        });
    });

    describe('GET ' + TEST_URL + '/' + testUserId, function () {
        it('returns status code 200 - found user', function (done) {
            request.get(TEST_URL + '/' + testUserId, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                let user: IUser = JSON.parse(body).data;
                logger.debug(`User retrieved: ${JSON.stringify(user)}`);
                expect(user.username).toBe(TEST_USERNAME);
                done();
            });
        });
    });

    describe('PUT ' + TEST_URL + '/' + testUserId, function () {
        const LASTNAME = 'The Boss';
        let testUser: IUser = {
            id: testUserId,
            firstname: 'Hugo',
            lastname: LASTNAME,
            type: UserType.STANDARD,
            username: TEST_USERNAME,
            password: '1234'
        };
        it('returns status code 200 - user updated', function (done) {
            request.put(TEST_URL + '/' + testUserId, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testUser)
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                let user: IUser = JSON.parse(body).data;
                logger.debug(`User updated: ${JSON.stringify(user)}`);
                expect(user.lastname).toBe(LASTNAME);
                done();
            });
        });
    });

    describe('DELETE ' + TEST_URL + '/' + testUserId, function () {
        it('returns status code 200 - user deleted', function (done) {
            request.delete(TEST_URL + '/' + testUserId, {
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                }
            }, function (error: any, response: RequestResponse, body: any) {
                expect(response.statusCode).toBe(200);
                testUserId = null;
                done();
            });
        });
    });

    afterAll(function () {
        if (testUserId) {
            logger.error(`AfterAll: test user with id ${testUserId} has not been deleted. Please clean it from the database manually.`);
        }
    });

});
