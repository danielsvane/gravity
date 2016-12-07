import Matter from "matter-js";
import Player from "../shared/Player";

export default class Game {

  constructor(){
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.stepInterval = undefined;
    this.players = [];
    this.planets = [];
    this.spots = [{
      x: 100,
      y: 300,
    },{
      x: 700,
      y: 300
    }];

    let planet = Matter.Bodies.circle(400, 300, 150, {isStatic: true});
    Matter.World.add(this.engine.world, planet);
    this.planets.push(planet);
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
    for(let planet of this.planets){
      for(let player of this.players){
        for(let bullet of player.bullets){
          var r = Matter.Vector.sub(planet.position, bullet.position);
          var mag = Matter.Vector.magnitude(r);
          var norm = Matter.Vector.normalise(r);
          var force = Matter.Vector.mult(norm, planet.circleRadius*bullet.mass*0.0025/mag);
          Matter.Body.applyForce(bullet, bullet.position, force);
        }
      }
    }
    Matter.Engine.update(this.engine);
  }

}
