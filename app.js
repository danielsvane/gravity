var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Gravity = require('./public/Game.js');
var Matter = require("./public/matter.min.js");

var game = new Gravity.Game(Matter);

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/sockettest.html');
});

var engine = undefined;
var stepInterval = undefined;

io.on('connection', function(socket){

  console.log("user connected");

  socket.on("create game", function(){
    console.log("create game message received");
    socket.emit("game created");
    createGame(socket);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function createGame(socket){
  engine = Matter.Engine.create();
  var boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
  var boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
  var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  Matter.World.add(engine.world, [boxA, boxB, ground]);

  Matter.Events.on(engine, "collisionStart", function(e){
    destroyGame(socket);
  });

  stepInterval = setInterval(step, 1000/30);
}

function destroyGame(socket){
  engine = undefined;
  clearInterval(stepInterval);
  socket.emit("game destroyed");
  console.log("destroyed game");
}

function step(){
  Matter.Engine.update(engine);
}
