var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');


app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


var name;

io.on('connection', (socket) => {
  socket.on('player-joined',function(msg){
    socket.join(msg);
  })
  socket.on('room', (msg) => {
    socket.to(msg.roomId).broadcast.emit(`room`, msg);         //sending message to all except the sender
  });
  socket.on('won',(msg)=>{
    socket.to(msg.roomId).broadcast.emit('won',msg);
  })
});

server.listen(3000, () => {
  console.log('Server listening on :3000');
});


