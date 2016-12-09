import http from "http";
import express from "express";
import path from "path";
import Matter from "matter-js";
import Game from "server/ServerGame";
import ioFactory from "socket.io";

let app = express();
let server = http.Server(app);
let io = ioFactory(server);

server.listen(80);
app.use(express.static('dist'));

let game = new Game(io);
game.start();

io.on('connection', function (socket) {
  game.addPlayer(socket.id);
  io.sockets.emit("game state", game.getState());

  socket.on("player rotate", function(angle){
    let player = game.player(socket.id);
    player.rotate(angle);
    socket.broadcast.emit("player rotate", player.socketId, player.body.angle);
  });

  socket.on("player shoot", function(){
    game.player(socket.id).shoot();
    io.sockets.emit("game state", game.getState());
  });
  //
  socket.on("disconnect", function(){
    game.removePlayer(socket.id);
    io.sockets.emit("game state", game.getState());
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve("sockettest.html"));
});
