const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let players = {};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    console.log('A user connected');

    players[socket.id] = {
        x: 400,
        y: 300
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', {Id: socket.id, x: players[socket.id].x, y: players[socket.id].y});

    socket.on('playerMovement', (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        socket.broadcast.emit('playerMoved', {Id: socket.id, x: players[socket.id].x, y: players[socket.id].y});
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


