const config = require('config');
const log = require('./log').child({ service: 'garage-door' });

const garageDoorServiceUri = config.get('services.garageDoor.uri');
const connectSocket = require('socket.io-client');

function startListening() {
  const socket = connectSocket(garageDoorServiceUri);
  log.info('connected');

  socket.on('disconnect', function () {
    log.info('disconnected');
  });

  socket.on('open', function (message) {
    log.info(message, 'open event received');
  });

  socket.on('close', function (message) {
    log.info(message, 'close event received');
  });
};

module.exports = {
  startListening
};
