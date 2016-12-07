import http from "http";
import express from "express";
import path from "path";
import Game from "../server/ServerGame";
import ioFactory from "socket.io";

let app = express();
let server = http.Server(app);
let io = ioFactory(server);

server.listen(80);
app.use(express.static('dist'));

let game = new Game();

io.on('connection', function (socket) {
  // Broadcast current players in the game before joining
  for(let player of game.players){
    socket.emit("add player", player.spot, player.socketId);
  }

  let spot = game.addPlayer(socket.id);

  io.sockets.emit("add player", spot, socket.id);

  socket.on("rotated", function(angle){
    let player = game.player(socket.id);
    player.rotate(angle);
    socket.broadcast.emit("rotate player", player.socketId, player.body.angle);
  });

  socket.on("player shot", function(){
    socket.broadcast.emit("player shot", socket.id);
  });

  socket.on("disconnect", function(){
    let spot = game.removePlayer(socket.id);
    io.sockets.emit("remove player", spot);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve("sockettest.html"));
});
