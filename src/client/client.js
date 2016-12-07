import ClientGame from "../client/ClientGame";
import io from "socket.io-client";


let game = new ClientGame();
game.start();

let socket = io("http://localhost:80");

socket.on("add player", function(spot, socketId){
  game.addPlayer(spot, socketId);
});

socket.on("rotate player", function(socketId, angle){
  game.player(socketId).setAngle(angle);
});

socket.on("player shot", function(socketId){
  game.player(socketId).shoot();
});

socket.on("remove player", function(spot){
  game.removePlayer(spot);
})

document.addEventListener("keydown", function(e){
  console.log(e.key);
  if(e.key === "ArrowLeft"){
    game.player(socket.id).rotate(-Math.PI/30);
    socket.emit("rotated", -Math.PI/30);
  }
  if(e.key === "ArrowRight"){
    game.player(socket.id).rotate(Math.PI/30);
    socket.emit("rotated", Math.PI/30);
  }
  if(e.key === " "){
    console.log(game.player(socket.id).bullets[0]);
    game.player(socket.id).shoot();
    socket.emit("player shot");
  }
  if(e.key === "s"){
    console.log("getting state");
    socket.emit("get state");
  }
});
