'use strict';

const log = require('./lib/log').child({ service: 'garage-door-text-message' });
const GarageDoorService = require('./lib/garage-door-service');
const TextMessageService = require('./lib/text-message-service');

GarageDoorService.startListening(function (err, socket) {
  if (err) {
    throw err;
  }

  const openMessage = 'Garage door is open';
  const closeMessage = 'Garage door is closed';

  socket.on('open', function (status) {
    log.info(status, 'open event received');
    TextMessageService.sendMessage(openMessage, function (err) {
      if (err) {
        return log.error(err);
      }
      log.info({ message: openMessage }, 'text message sent');
    });
  });

  socket.on('close', function (status) {
    log.info(status, 'close event received');
    TextMessageService.sendMessage(closeMessage, function (err) {
      if (err) {
        return log.error(err);
      }
      log.info({ message: closeMessage }, 'text message sent');
    });
  });
});
