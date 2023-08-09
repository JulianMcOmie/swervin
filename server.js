const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});

// let players = {};

// io.on('connection', socket => {
//   players[socket.id] = {
//     x: 400,
//     y: 300
//   };

//   socket.emit('currentPlayers', players);
//   socket.broadcast.emit('newPlayer', players[socket.id]);

//   socket.on('disconnect', () => {
//     delete players[socket.id];
//     io.emit('disconnect', socket.id);
//   });

//   socket.on('playerMovement', (movementData) => {
//     players[socket.id].x = movementData.x;
//     players[socket.id].y = movementData.y;
//     socket.broadcast.emit('playerMoved', players[socket.id]);
//   });
// });