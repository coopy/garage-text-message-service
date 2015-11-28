'use strict';

const config = require('config');
const log = require('./log').child({ service: 'garage-door' });

const garageDoorServiceUri = config.get('services.garageDoor.uri');
const connectSocket = require('socket.io-client');

let socket;

function startListening(callback) {
  socket = connectSocket(garageDoorServiceUri);
  log.info('socket connected');

  socket.on('disconnect', function () {
    log.info('socket disconnected');
  });

  callback(null, socket);
};

module.exports = {
  startListening,
  socket
};
