"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
let players = {};
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/dist', express_1.default.static(path_1.default.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
app.get('/dist/bundle.js', (req, res) => {
    fs_1.default.readFile(path_1.default.join(__dirname, 'dist', 'bundle.js'), (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).end();
        }
        else {
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
    };
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { Id: socket.id });
    socket.on('playerMovement', (movementData) => {
        players[socket.id] = movementData;
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
