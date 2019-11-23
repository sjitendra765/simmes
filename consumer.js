var express  = require('express');
var path  = require('path');
var bodyParser = require('body-parser') ;

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var PORT = 3000;
server.listen(PORT);
console.log('Server is running');
var kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient(),
  consumer = new Consumer(client, [{ topic: "kafkapubsub", partition: 0 }], {
    autoCommit: false
  });
  const connections = [];
  io.sockets.on('connection',(socket) => {
    connections.push(socket);
    console.log(' %s sockets is connected', connections.length);
 
    socket.on('disconnect', () => {
       connections.splice(connections.indexOf(socket), 1);
    });
    consumer.on("message", function(message) {
          var msg = JSON.parse(message.value)
          if(msg.priority >= 7){ //filter information >= 7
            console.log(msg)
            io.sockets.emit('new message', {message: msg}); //send information to frontend
          }
          
    });
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});