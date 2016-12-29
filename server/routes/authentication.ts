'use strict';

import express = require('express');
export let authenticationRoute = express.Router();
import {IUserModel, User} from '../models/user.model'
import {IUser} from '../entities/user.interface';

let tokenUserMap: Map<string, IUserModel> = new Map<string, IUserModel>();

authenticationRoute.post('/api/authenticate', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let jsonBody: string = JSON.stringify(req.body);
    console.log(`authenticate: ${jsonBody}`);
    let username: String = req.body.username;
    let password: String = req.body.password;
    let selector = {'username': username}
    User.find(selector, (err: any, users: IUserModel[]) => {
        if (err) {
            res.status(401).json({error: `username ${username} unknown. ${err}`});
        } else {
            // verify the password
            if (users.length && users[0].password === password) {
                // TODO: create proper jwt token.
                // TODO: It would be simpler to use username + password for each REST request instead of a jwt token!
                let authToken = 'fake-jwt-token ' + users[0]._id;
                let user: IUserModel = users[0];
                user.id = user._id;
                tokenUserMap.delete(authToken);
                tokenUserMap.set(authToken, user);
                console.log(`user ${user.username} authenticated successfully`);
                res.json({
                    token: authToken,
                    data: users[0]
                });
            } else if (users.length == 0) {
                res.status(401).json({error: `user ${username} unknown`});
            } else {
                res.status(401).json({error: `user ${username} wrong password`});
            }
        }
    });
});

authenticationRoute.use('/api', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let authHeader = req.get('Authorization');
    if (authHeader && tokenUserMap.get(authHeader)) {
        let user: IUserModel = tokenUserMap.get(authHeader);
        console.log(`user ${user.username} is authenticated with token ${authHeader}`);
        next();
    } else {
        res.status(401).json({error: 'not yet authenticated'});
    }
});

