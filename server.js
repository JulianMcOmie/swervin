const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { SocketAddress } = require('net');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let players = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

// BAD (probably)
app.get('/dist/bundle.js', (req, res) => {
  fs.readFile(path.join(__dirname, 'dist', 'bundle.js'), (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.setHeader('Content-Type', 'application/javascript');
      res.end(data);
    }
  });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    players[socket.id] = {
        x: 400,
        y: 300,
        velocityX: 0,
        velocityY: 0
    }

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', socket.id);

    socket.on('playerMovement', (movementData) => {
        players[socket.id] = movementData
        socket.broadcast.emit('playerMoved', {
            Id: socket.id,
            movementData: players[socket.id]
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete players[socket.id];
        socket.broadcast.emit("userDisconnect", socket.id);
        socket.disconnect();
    });


});

server.listen(8080, () => {
    console.log('listening on *:8080');
});


