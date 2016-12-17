import Matter from "matter-js";
import Player from "../shared/Player";

export default class Game {

  constructor(interval = 33){
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.stepInterval = undefined;
    this.interval = interval;
    this.expected = Date.now()+this.interval;
    this.width = 2000;
    this.height = 2000;
    this.players = [];
    this.planets = [];
    this.bounds = [];
    this.spots = [{
      x: 250,
      y: 250,
      color: "#2467cc"
    },{
      x: 1750,
      y: 1750,
      color: "#d32626"
    }];

    this.addPlanet(1050, 950, 170);
    this.addPlanet(250, 700, 120);

    this.addPlanet(1700, 500, 250);

    // this.addPlanet(550, 450, 170);
    // this.addPlanet(250, 700, 120);

    this.createBounds();
    this.setupCollisionEvents();
  }

  sendState(){
    //setTimeout(() => {
      this.io.emit("game state", this.getState());
    //}, 0);
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
        for(let ability of player.currentAbilities){
          if(ability.abilityId === 0){
            let r = Matter.Vector.sub(planet.position, ability.position);
            let mag = Matter.Vector.magnitudeSquared(r);
            let norm = Matter.Vector.normalise(r);
            let force = Matter.Vector.mult(norm, Math.pow(planet.circleRadius, 3)*ability.mass*0.000008/mag); // 0.001
            Matter.Body.applyForce(ability, {x: 0, y: 0}, force);
          }
        }
      }
    }

    this.checkAbilityTime();
    this.decreaseCooldowns();
    Matter.Engine.update(this.engine, time);

    this.expected += this.interval;
    setTimeout(this.step.bind(this), this.interval-dt);
  }

  decreaseCooldowns(){
    for(let player of this.players){
      for(let ability of player.abilities){
        ability.decreaseCooldown();
      }
    }
  }

  checkAbilityTime(){
    for(let player of this.players){
      for(let i in player.currentAbilities){
        let ability = player.currentAbilities[i];
        ability.time--;
        if(ability.time < 0){
          player.removeCurrentAbility(i);
        }
      }
    }
  }

  setupCollisionEvents(){
    Matter.Events.on(this.engine, "collisionEnd", this.handleCollision.bind(this));
  }

  handleCollision(e){
    let wasPlayerHit = false;

    for(let pair of e.pairs){
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
      else break;

      // Find the player hit, and decrease lives
      for(let player of this.players){
        if(player.body.id == body.id){
          this.removeBullet(bullet);
          player.hit();
          wasPlayerHit = true;
          break;
        }
      }
    }

    if(wasPlayerHit && this.io) this.sendState();

  }

}
