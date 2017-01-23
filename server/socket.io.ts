/**
 * Created by david on 18.01.17.
 */
import express = require('express');
import {Socket} from "net";
var net = require('net');
var http = require('http');
var io = require('socket.io');
var socketioJwt = require('socketio-jwt');


export class socketio {

  public constructor(private app: express.Express) {
    const httpApp = http.Server(app);
    const socketIo = io(httpApp);
    socketIo.use(socketioJwt.authorize({
      secret: 'secret',
      handshake: true
    }));

    socketIo.on('connection', function(socket: any) {
      console.log('hello! ', socket.decode_token.name);
    })
  }




}
