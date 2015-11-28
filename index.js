'use strict';

const log = require('./lib/log').child({ service: 'garage-door-text-message' });
const GarageDoorService = require('./lib/garage-door-service');
const TextMessageService = require('./lib/text-message-service');
const TextMessageWebhookService = require('./lib/text-message-webhook');

GarageDoorService.startListening(function (err, socket) {
  if (err) {
    throw err;
  }

  const messages = {
    open: 'Garage door is open',
    close:'Garage door is closed'
  };

  TextMessageWebhookService.startListening(messages, function (err) {
    if (err) {
      return log.err(err, 'could not start text message receiving webhook');
    }
  });

  socket.on('open', function (status) {
    log.info(status, 'open event received');
    TextMessageService.sendMessage(messages.open, function (err) {
      if (err) {
        return log.error(err);
      }
      log.info({ message: messages.open }, 'text message sent');
    });
  });

  socket.on('close', function (status) {
    log.info(status, 'close event received');
    TextMessageService.sendMessage(messages.close, function (err) {
      if (err) {
        return log.error(err);
      }
      log.info({ message: messages.close }, 'text message sent');
    });
  });
});
