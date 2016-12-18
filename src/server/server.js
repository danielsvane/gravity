import http from "http";
import express from "express";
import path from "path";
import Game from "../server/ServerGame";
import GameManager from "../server/GameManager";
import ioFactory from "socket.io";

let app = express();
let server = http.Server(app);
let io = ioFactory(server);
let gm = new GameManager(io);

server.listen(process.env.PORT || 80);
app.use(express.static('dist'));
app.set("view engine", "pug");

let games = {};

app.get("/:id", function(req, res){
  let id = req.params.id;
  gm.addGame(id);
  res.sendFile(path.resolve("sockettest.html"));
});
