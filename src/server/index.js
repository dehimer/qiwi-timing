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
  socket.emit('action', { type: 'config', payload: config });
});


const updateUnselectTimeout = (function () {
  let unselectSpeakerTimeoutF;
  return (id) => {
    if (unselectSpeakerTimeoutF) {
      clearTimeout(unselectSpeakerTimeoutF);
      unselectSpeakerTimeoutF = null;
    }

    if (id) {
      unselectSpeakerTimeoutF = setTimeout(() => {
        clearTimeout(unselectSpeakerTimeoutF);
        unselectSpeakerTimeoutF = null;

        can.emit('speaker:select', null);
      }, config.autoUnselectTime*1000*60)
    }
  }
})();


can.on('speaker:select', (id, socket = io) => {
  if (state.speaker === id) {
    id = null;
  }

  state.speaker = id;
  socket.emit('action', { type: 'speaker:selected', payload: id });

  updateUnselectTimeout(id);
});
