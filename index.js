const path = require('path');
const http = require("http");
const express = require('express');
const socketio = require('socket.io');
var Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./src/utils/messages')

const { addUser , removeUser , getUser ,getUsersInRoom} = require('./src/utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: "http://localhost:8000/" ,
    methods: ["GET", "POST"]
  }
});


app.use(express.static(path.join(__dirname, './public')));

io.on('connection', (socket) => {
  console.log('connected to websocket .. ');

  socket.on('join', (options , cb) => {
    
    const { error, user } = addUser({ id: socket.id,...options })
    if (error) {
      return cb(error);
    }

    // console.log(user)

    socket.join(user.room);
    
  socket.emit('message', generateMessage('Admin' , 'welcome ..'))
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined to room .`));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    cb();
  })

  socket.on('sendMessage', (msg, cb) => {

    const user = getUser(socket.id)
    const filter = new Filter();
    if (filter.isProfane(msg))
    { 
      return cb('Profanity is not allowed .');
      }
    io.to(user.room).emit('message', generateMessage(user.username,msg));
    cb();
  })


  

  socket.on('shareLocationUser', (coords, cb) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
    cb();
  })
 

  socket.on('disconnect', (msg) => {
    const user = removeUser(socket.id) 
    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} left room.`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
 
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
