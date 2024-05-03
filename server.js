const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/midi', (req, res) => {
  res.sendFile(path.join(__dirname, './test.mid'));
});

wss.on('connection', (ws) => {
  const player = new MidiPlayer.Player();

  player.loadFile(path.join(__dirname, './test.mid'));

  player.on('midiEvent', (event) => {
    if (event.name === 'Note on' || event.name === 'Note off') {
      ws.send(JSON.stringify(event));
    }
  });

  player.on('endOfFile', () => {
    ws.send(JSON.stringify({ event: 'endOfFile' }));
  });

  player.play();
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
