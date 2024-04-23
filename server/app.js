const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));

var nome = '';
var Players = [];

app.get('/game', (req, res) => {
  res.sendFile(join(__dirname, '../index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../home.html'));
});

app.post('/', (req, res) => {
  const input = req.body.nome;
  nome = input;

  res.sendFile(join(__dirname, '../index.html'));
});

io.on('connection', (socket) => {
  Players.push({ id: socket.id, x: 0, y: 0, name: nome })
  socket.emit('Players', Players);
  console.log('Novo usuário conectado. ID do socket:', socket.id);


  socket.on('move', (coords) => {
    Players = Players.map((e) => {
      if (e.id == socket.id) {
        e.x = coords.x;
        e.y = coords.y;
      }
      return e;
    });
    socket.emit('Players', Players);
  });

  socket.on('disconnect', () => {
    Players = Players.filter((e) => e.id !== socket.id);
    console.log('Usuário desconectado. ID do socket:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});