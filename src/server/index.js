const express = require('express');
const fs = require('fs');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const Emitter = require('events');
const _ = require('underscore');

const can = new Emitter();

const configPath = path.join(__dirname, '..', '..', 'config', 'config.js');
let config = require(configPath);
fs.watchFile(configPath, () => {
  delete require.cache[require.resolve(configPath)];
  config = require(configPath);
});

// HTTP
const port = config.port;
const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));


server.listen(port, () => {
  console.log(`Server is ran on : http://localhost:${port}`);
});

const state = {
  speaker: null,
};


// SOCKETIO
const io = socketIO();
io.attach(server);

io.on('connection', (socket) => {
  can.emit('config:sync', socket);

  socket.on('action', (action) => {
    console.log('action');
    console.log(action);
    const { type, payload } = action;
    switch (type) {
      case 'server/selectSpeaker':
        const id = payload;
        can.emit('speaker:select', id);
        break;
      default: console.log(`Unknown action ${type}`);
    }
  });
});

can.on('config:sync', (socket = io) => {
  console.log('config:sync');
  socket.emit('action', { type: 'config', payload: config });
});

can.on('speaker:select', (id, socket = io) => {
  console.log(`speaker:select ${id}`);
  state.speaker = id;
  socket.emit('action', { type: 'speaker:selected', payload: id });
});
