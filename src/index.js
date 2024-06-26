const path = require('path');
const http = require("http");
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: "http://localhost:8000/" ,
    methods: ["GET", "POST"]
  }
});

let count = 0;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  
  socket.emit('message' , 'welcome . !')
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
