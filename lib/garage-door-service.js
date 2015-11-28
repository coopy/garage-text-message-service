'use strict';

const config = require('config');
const log = require('./log').child({ service: 'garage-door' });

const garageDoorServiceUri = config.get('services.garageDoor.uri');
const connectSocket = require('socket.io-client');

let socket;
let openState;

function startListening(callback) {
  socket = connectSocket(garageDoorServiceUri);
  log.info('socket connected');

  socket.on('disconnect', function () {
    log.info('socket disconnected');
  });

  socket.on('open', function () {
    openState = true;
  });

  socket.on('close', function () {
    openState = false;
  });

  callback(null, socket);
};

module.exports = {
  startListening,
  getSocket() {
    return socket;
  },
  getOpenState() {
    log.debug({openState});
    return openState;
  }
};
