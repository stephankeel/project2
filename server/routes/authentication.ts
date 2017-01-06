'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import eJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import {IUserModel, User} from '../models/user.model'
import {IUser} from '../entities/user.interface';

export let authenticationRoute = express.Router();

authenticationRoute.post('/api/authenticate', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let jsonBody: string = JSON.stringify(req.body);
    logger.info(`authenticate: ${jsonBody}`);
    let username: String = req.body.username;
    let password: String = req.body.password;
    let selector = {'username': username}
    User.find(selector, (err: any, users: IUserModel[]) => {
        if (err) {
            res.status(401).json({error: `username ${username} unknown. ${err}`});
        } else {
            // verify the password
            if (users.length && users[0].password === password) {
                let user: IUserModel = users[0];
                user.id = user._id;
                // TODO: das Passwort 'secret' muss noch ersetzt werden. Am besten mit einem privaten und einem öffentlichen Schlüssel.
                let authToken = jwt.sign({id: user.id, username: user.username, userType: user.type}, "secret", {expiresIn: "1h"});
                logger.info(`user ${user.username} authenticated successfully`);
                res.json({
                    token: authToken
                });
            } else if (users.length == 0) {
                res.status(401).json({error: `user ${username} unknown`});
            } else {
                res.status(401).json({error: `user ${username} wrong password`});
            }
        }
    });
});

// TODO: das Passwort 'secret' muss noch ersetzt werden. Am besten mit einem privaten und einem öffentlichen Schlüssel.
authenticationRoute.use('/api', eJwt({secret: 'secret'}), function (req: express.Request & jwtTypeExtension.Authenticated<IUserModel>, res: express.Response, next: express.NextFunction) {
    if (req.user) {
        logger.info(`userid: ${req.user.id}, username: ${req.user.username}, req.body: ` + JSON.stringify(req.body));
        next();
    } else {
        res.status(401).json({error: 'not yet authenticated'});
    }
});

declare namespace jwtTypeExtension {
    export interface Authenticated<T> {
        user: T;
    }
}
