import http from "http";
import express from "express";
import path from "path";
import Game from "../shared/Game";
import ioFactory from "socket.io";


console.log(io);

let app = express();
let server = http.Server(app);
let io = ioFactory(server);

server.listen(80);

app.use(express.static('dist'));

let game = new Game();

app.get('/', function (req, res) {
  res.sendFile(path.resolve("sockettest.html"));
});

io.on('connection', function (socket) {
  socket.on("rotated", function(angle){
    console.log(angle);
  });
});
