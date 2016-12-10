import Game from "./src/server/ServerGame";
import now from "performance-now";

let samples = 100;
let start = 0;
let game = undefined;

let createGame = function(){
  game = new Game();
  for(let i=0; i<2; i++){
    game.addPlayer(i);
  }
  for(let i=0; i<2; i++){
    game.players[i].shoot();
  }
}

let avgTime = function(div = samples){
  console.log(((now()-start)/div).toFixed(3), "ms\n");
}

// console.log("adding player");
//
// start = now();
// for(let i=0; i<samples; i++){
//   game.addPlayer(i);
// }
// avgTime();

// console.log("adding bullet");
// start = now();
// for(let i=0; i<samples; i++){
//   game.players[i].shoot();
// }
// avgTime();



console.log("step");
createGame();
start = now();
for(let i=0; i<samples; i++){
  game.step();
}
avgTime();

console.log("step2");
createGame();
start = now();
for(let i=0; i<samples; i++){
  game.step2();
}
avgTime();

console.log("handle collision");
createGame();
start = now();
game.handleCollision({
  pairs: [{
    bodyA: game.players[0].body,
    bodyB: game.players[0].bullets[0]
  }]
});
avgTime(1);

console.log("handle collision 2");
createGame();
start = now();
game.handleCollision({
  pairs: [{
    bodyA: game.players[0].body,
    bodyB: game.players[0].bullets[0]
  }]
});
avgTime(1);

// console.log("step3");
// start = now();
// for(let i=0; i<samples; i++){
//   game.step3();
// }
// avgTime();

process.exit();
