module.exports = {
  log: {
    level: 'info'
  },
  server: {
    port: 5002
  },
  services: {
    garageDoor: {
      uri: 'ws://10.0.1.6:5001'
    }
  }
}
