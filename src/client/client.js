import ClientGame from "ClientGame";
import io from "socket.io-client";

let game = new ClientGame();
game.start();

let socket = io("http://localhost:80");

socket.on("game state", function(state){
  game.setState(state);
});

socket.on("player rotate", function(socketId, angle){
  game.player(socketId).setAngle(angle);
});

document.addEventListener("keydown", function(e){
  if(e.key === "ArrowLeft"){
    game.player(socket.id).rotate(-Math.PI/30);
    socket.emit("player rotate", -Math.PI/30);
  }
  if(e.key === "ArrowRight"){
    game.player(socket.id).rotate(Math.PI/30);
    socket.emit("player rotate", Math.PI/30);
  }
  if(e.key === " "){
    game.player(socket.id).shoot();
    socket.emit("player shoot");
  }
});
