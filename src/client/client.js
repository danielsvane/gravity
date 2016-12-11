import ClientGame from "../client/ClientGame";

let game = new ClientGame();
game.start();

let socket = io();

socket.on("connect", function(){
  for(let i=1; i<11; i++){
    setTimeout(() => {
      socket.emit("foo", Date.now());
    }, 200*i);
  }
});

let pingChecks = 0;
let adjustedTimeSum = 0;
socket.on("bar", function(clientTime, serverTime){
  let roundTime = Date.now()-clientTime;
  console.log("round time");
  let adjustedDifference = Date.now()-serverTime+roundTime/2;
  adjustedTimeSum += adjustedDifference;
  pingChecks++;
  if(pingChecks >= 10){
    game.serverClientTimeDiff = adjustedTimeSum/10;
    console.log("average difference in client and server time", adjustedTimeSum/10);
  }
});

socket.on("game state", function(state){
  game.setState(state);
});

socket.on("player rotate", function(socketId, angle){
  game.player(socketId).setAngle(angle);
});

socket.on("player set power", function(socketId, power){
  game.player(socketId).power = power;
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
  if(e.key === "ArrowUp"){
    game.player(socket.id).increasePower();
    socket.emit("player increase power");
  }
  if(e.key === "ArrowDown"){
    game.player(socket.id).decreasePower();
    socket.emit("player decrease power");
  }
  if(e.key === " "){
    //game.player(socket.id).shoot();
    socket.emit("player shoot");
  }
  if(e.key === "p"){
    socket.emit("foo", Date.now());
  }
});

document.addEventListener("wheel", function(e){
  if(e.deltaY < 0) game.render.zoomIn();
  if(e.deltaY > 0) game.render.zoomOut();
});

let startX = 0;
let startY = 0;
document.addEventListener("mousedown", function(e){
  startX = e.clientX;
  startY = e.clientY;
  document.addEventListener("mousemove", drag);
});

function drag(e){
  game.render.offsetX += e.clientX-startX;
  game.render.offsetY += e.clientY-startY;

  startX = e.clientX;
  startY = e.clientY;
}

window.addEventListener("resize", function(){
  game.render.resize();
});

document.addEventListener("mouseup", function(){
  document.removeEventListener("mousemove", drag);
});
