import Matter from "matter-js";
import Player from "../shared/Player";

export default class Game {

  constructor(interval = 33){
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.stepInterval = undefined;
    this.interval = interval;
    this.expected = Date.now()+this.interval;
    this.width = 1000;
    this.height = 1000;
    this.players = [];
    this.planets = [];
    this.bounds = [];
    this.spots = [{
      x: 150,
      y: 150,
      color: "#2467cc"
    },{
      x: 850,
      y: 850,
      color: "#d32626"
    }];

    this.addPlanet(550, 450, 170);
    this.addPlanet(250, 700, 120);

    this.createBounds();
    this.setupCollisionEvents();
  }

  sendState(){
    setTimeout(() => {
      this.io.sockets.emit("game state", this.getState());
    }, 200);
  }

  addPlanet(x, y, radius){
    var planet = Matter.Bodies.circle(x, y, radius, {
      collisionFilter: {
        category: 0x0001
      }
    });
    Matter.Body.setStatic(planet, true);
    planet.restitution = 1;
    planet.friction = 0.05;
    planet.frictionAir = 0;
    planet.frictionStatic = 0;
    Matter.World.add(this.engine.world, planet);
    this.planets.push(planet);
  }

  createBounds(){
    this.createBound(5, this.height/2, 10, this.height);
    this.createBound(this.width/2, 5, this.width, 10);
    this.createBound(this.width-5, this.height/2, 10, this.height);
    this.createBound(this.width/2, this.height-5, this.width, 10);
  }

  createBound(x, y, width, height){
    let bound = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      collisionFilter: {
        category: 0x0002
      }
    });

    Matter.World.add(this.engine.world, bound);
    this.bounds.push(bound);
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

  step(time = this.interval){
    let dt = Date.now()-this.expected;

    for(let planet of this.planets){
      for(let player of this.players){
        for(let bullet of player.bullets){
          let r = Matter.Vector.sub(planet.position, bullet.position);
          let mag = Matter.Vector.magnitude(r);
          let norm = Matter.Vector.normalise(r);
          let force = Matter.Vector.mult(norm, planet.circleRadius*bullet.mass*0.001/mag);
          Matter.Body.applyForce(bullet, bullet.position, force);
        }
      }
    }
    this.checkBulletTime();
    Matter.Engine.update(this.engine, time);

    this.expected += this.interval;
    setTimeout(this.step.bind(this), this.interval-dt);
  }

  checkBulletTime(){
    for(let player of this.players){
      for(let i in player.bullets){
        let bullet = player.bullets[i];
        bullet.time--;
        if(bullet.time < 0){
          player.removeBullet(i);
        }
      }
    }
  }

  setupCollisionEvents(){
    Matter.Events.on(this.engine, "collisionEnd", this.handleCollision.bind(this));
  }

  handleCollision(e){
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
        player.hit();
        if(this.io) this.sendState();
        break;
      }
    }
  }

}
