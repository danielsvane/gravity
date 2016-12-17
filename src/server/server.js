import http from "http";
import express from "express";
import path from "path";
import Game from "../server/ServerGame";
import ioFactory from "socket.io";

let app = express();
let server = http.Server(app);
let io = ioFactory(server);

server.listen(process.env.PORT || 80);
app.use(express.static('dist'));
app.set("view engine", "pug");

let games = {};

app.get("/:id", function(req, res){
  let id = req.params.id;

  if(!games[id]){
    let ns = io.of("/"+id);
    let game = new Game(ns);

    games[id] = game;
    game.start();
  }


  //res.render('index', { namespace: 'Hey', message: 'Hello there!' })
  res.sendFile(path.resolve("sockettest.html"));
  //res.redirect("/");
});

// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!' })
// });

// app.get('/', function (req, res) {
//   let game = new Game(io);
//   game.start();
//   res.sendFile(path.resolve("sockettest.html"));
// });
