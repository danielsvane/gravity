import ClientGame from "../client/ClientGame";
import io from "socket.io-client";


let game = new ClientGame();
game.start();

let socket = io("http://localhost:80");

socket.on("add player", function(spot, socketId){
  game.addPlayer(spot, socketId);
});

socket.on("rotate player", function(spot, angle){
  game.player(spot).rotate(angle);
})

socket.on("remove player", function(spot){
  game.removePlayer(spot);
})

document.addEventListener("keydown", function(e){
  if(e.key === "ArrowLeft"){
    game.player(socket.id).rotate(-Math.PI/30);
    socket.emit("rotated", -Math.PI/30);
  }
  if(e.key === "ArrowRight"){
    game.player(socket.id).rotate(Math.PI/30);
    socket.emit("rotated", Math.PI/30);
  }
});
