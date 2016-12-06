import http from "http";
import express from "express";
import path from "path";
import Game from "../shared/game.js";

let app = express();
app.use(express.static('dist'));

let game = new Game();
console.log(game.foo);

app.get('/', function (req, res) {
  res.sendFile(path.resolve("sockettest.html"));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
