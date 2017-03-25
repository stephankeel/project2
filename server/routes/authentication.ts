'use strict';

import {getLogger, Logger} from "../utils/logger";
import {IUserDocument, UserModel} from "../models/user.model";
import {IUser} from "../entities/user.interface";
import {JwtConfiguration} from "../utils/jwt-configuration";
import express = require('express');
import eJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');

const LOGGER: Logger = getLogger('authentication');


export function getAuthenticationRoute(jwtConfig: JwtConfiguration) {
  let authenticationRoute = express.Router();

  authenticationRoute.post('/api/authenticate', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let username: String = req.body.username;
    let password: String = req.body.password;
    LOGGER.info(`authenticate: ${username}`);
    let selector = {'username': username}
    UserModel.find(selector, (err: any, users: IUserDocument[]) => {
      if (err) {
        res.status(401).json({error: `username ${username} unknown. ${err}`});
      } else {
        // verify the password
        if (users.length) {
          bcrypt.compare(password, users[0].password, (err, result) => {
            if (err || !result) {
              res.status(401).json({error: `Incorrect username or password.`});
            } else {
              let user: IUserDocument = users[0];
              user.id = user._id;
              let authToken = jwt.sign({
                id: user.id,
                username: user.username,
                type: user.type
              }, jwtConfig.getSignSecret(), jwtConfig.getSignOptions());
              LOGGER.info(`user ${user.username} authenticated successfully`);
              res.json({
                token: authToken
              })
            }
          });
        } else {
          res.status(401).json({error: `Incorrect username or password.`});
        }
      }
    });
  });

  authenticationRoute.use('/api', eJwt({
    secret: jwtConfig.getVerifySecret(),
    algorithms: ['RS256', 'HS256']
  }), function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.user) {
      LOGGER.debug(`userid: ${req.user.id}, username: ${req.user.username}, type: ${req.user.type}, req.body: ` + JSON.stringify(req.body));
      next();
    } else {
      res.status(401).json({error: 'not yet authenticated'});
    }
  });

// Used for REST test
  authenticationRoute.get('/api/authenticated', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json('authentication is valid');
  });

  return authenticationRoute;
}

// Augmenting the express Request interface with user: IUser to have user access where ever express.Request is used.
declare module '@types/express' {
  export interface Request {
    user?: IUser;
  }
}



