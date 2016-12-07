import Matter from "matter-js";
import Player from "../shared/Player";

export default class Game {

  constructor(){
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.stepInterval = undefined;
    this.players = [];
    this.spots = [{
      x: 100,
      y: 300,
    },{
      x: 700,
      y: 300
    }];

    let planet = Matter.Bodies.circle(400, 300, 150, {isStatic: true});
    Matter.World.add(this.engine.world, planet);

    //this.addPlayer(100, 300);
  }

  player(socketId){
    for(let player of this.players){
      if(player.socketId == socketId){
        return player;
      }
    }
  }

  start(){
    this.stepInterval = setInterval(this.step.bind(this), 1000/30);
  }

  step(){
    Matter.Engine.update(this.engine);
  }

}
