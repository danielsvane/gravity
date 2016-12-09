import Matter from "matter-js";
import Player from "../shared/Player";

export default class Game {

  constructor(interval = 33){
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.stepInterval = undefined;
    this.interval = interval;
    this.expected = Date.now()+this.interval;
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

    this.setupCollisionEvents();
  }

  player(socketId){
    for(let player of this.players){
      if(player.socketId == socketId){
        return player;
      }
    }
  }

  removeBullet(bullet){
    for(let player of this.players){
      for(let i in player.bullets){
        let _bullet = player.bullets[i];
        if(_bullet === bullet){
          player.removeBullet(i);
        }
      }
    }
  }

  start(){
    setTimeout(this.step.bind(this), this.interval);
  }

  step(){
    let dt = Date.now()-this.expected;

    for(let planet of this.planets){
      for(let player of this.players){
        for(let bullet of player.bullets){
          var r = Matter.Vector.sub(planet.position, bullet.position);
          var mag = Matter.Vector.magnitude(r);
          var norm = Matter.Vector.normalise(r);
          var force = Matter.Vector.mult(norm, planet.circleRadius*bullet.mass*0.0003/mag);
          Matter.Body.applyForce(bullet, bullet.position, force);
        }
      }
    }
    Matter.Engine.update(this.engine, this.interval);

    this.expected += this.interval;
    setTimeout(this.step.bind(this), this.interval-dt);
  }

  setupCollisionEvents(){
    Matter.Events.on(this.engine, "collisionEnd", (e) => {
      let pair = e.pairs[0];
      let body;
      let bullet;
      if(pair.bodyA.label == "player" && pair.bodyB.label == "bullet"){
        body = pair.bodyA;
        bullet = pair.bodyB;
      }
      else if(pair.bodyB.label == "player" && pair.bodyA.label == "bullet"){
        body = pair.bodyB;
        bullet = pair.bodyA;
      }
      else return;

      // Find the player hit, and decrease lives
      for(let player of this.players){
        if(player.body.id == body.id){
          this.removeBullet(bullet);
          if(this.io) this.io.sockets.emit("game state", this.getState());
          break;
        }
      }
    });
  }

}
