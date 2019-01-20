const express = require('express');
const http = require('http');
const path = require('path');
const socket = require('socket.io');
const net = require('net');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const PORT = 5000;
const PORT_SERVER = 3000;

let list = [];

app.use('/narekkeryan/multi-buzzer', express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

io.on('connection', socket => {
    socket.on('reset', data => {
        list = [];
        io.emit('pushed', list);
    });
    socket.on('toggleConnection', data => io.emit('toggleConnection', data));
});

server.listen(PORT_SERVER, console.log(`Listening to ${PORT}!`));

net.createServer(function (socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    socket.on('data', function (data) {
        if (!list.includes(data.toString('utf8'))) {
	    console.log('data', data.toString('utf8'));
            list.push(data.toString('utf8'));
            io.emit('pushed', list);
        }
    });
}).listen(PORT, "192.168.137.1");
