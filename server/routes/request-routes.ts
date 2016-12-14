'use strict';

import express = require('express');
export let router = express.Router();
import {IUserModel, User} from '../models/user.model'

router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.send('Hello there!');
    next();
});

router.post('/user', function(req: express.Request, res: express.Response, next: express.NextFunction) {
    let user: IUserModel = new User(req.body);
    let jsonBody: string = JSON.stringify(req.body);
    console.log(`create user: ${jsonBody}`);
    user.save((err: any, addedUser: IUserModel) => {
       if (err) {
           res.json({info: 'Error creating user', error: err});
       } else {
           addedUser.id = addedUser._id;
           res.json({info: 'User created successfully', data: addedUser});
       }
       next();
    });
});

router.put('/user/:id', function(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    let jsonBody: string = JSON.stringify(req.body);
    console.log(`update user [${id}]: ${jsonBody}`);
    User.findById(id,  (err: any, user: IUserModel) => {
        if (err) {
            res.json({info: `User ${id} not found`, error: err});
        }
        // copy the properties
        user.id = req.body.id;
        user.lastname = req.body.lastname;
        user.firstname = req.body.firstname;
        user.type = req.body.type;
        user.username = req.body.username;
        user.password = req.body.password;
        // save the updated user
        user.save((err: any, updatedUser: IUserModel) =>
        {
            if (err) {
                res.json({info: `Error updating user ${id}`, error: err});
            }
            res.json({info: 'User updated successfully', data: updatedUser});
            next();
        });
    });
});

router.get('/users', function(req: express.Request, res: express.Response, next: express.NextFunction){
    User.find((err, users) => {
       if (err) {
           res.json({info: 'Error creating user', error: err});
       }
        res.json({info: 'Users found successfully', data: users});
        next();
    });
});

router.delete('/user/:id', function(req: express.Request, res: express.Response, next: express.NextFunction){
    let ref = {_id: req.params.id};
    User.remove( ref, (err) => {
        if (err) {
            res.json({info: 'Error deleting user', error: err});
        }
        res.json({info: 'User deleted successfully', data: ref._id});
        next();
    });
});
