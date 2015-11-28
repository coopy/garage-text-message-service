'use strict';

const config = require('config');
const http = require('http');

const GarageDoorService = require('./garage-door-service');
const log = require('./log').child({ service: 'text-message-webhook' });

const port = config.get('server.port');
const state = {
  messages: null,
  status: null
};

function getMessageXml(message) {
  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<Response><Message>${message}</Message></Response>`;
}

function handleRequest(request, response){
  if (request.method === 'POST' && request.url === '/incoming') {
    log.info({ route: request.url, body: request.body }, 'incoming text message');
    log.debug(state.status);
    const message = state.messages[state.status];
    response.writeHead(200, { 'Content-Type': 'application/xml' });
    response.end(getMessageXml(message));
  } else {
    response.writeHead(404);
    response.end();
  }
}

const server = http.createServer(handleRequest);

function startListening(messages, callback) {
  state.messages = messages;
  server.listen(port, function (err) {
    if (err) {
      return callback(err);
    }
    log.info({ port }, 'listening');
  });

  const garageDoorEvents = GarageDoorService.getSocket();
  state.status = GarageDoorService.getOpenState();

  garageDoorEvents.on('open', function () {
    state.status = 'open';
  });

  garageDoorEvents.on('close', function () {
    state.status = 'close';
  });

  callback(null);
}

module.exports = {
  startListening
};
