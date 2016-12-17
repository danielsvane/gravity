import Matter from "matter-js";
import {BulletAbility, WallAbility} from "../shared/Ability";

export default class Player {
  constructor(engine, x, y, spot, socketId, settings = undefined, currentAbilities = undefined, abilities = undefined){
    this.engine = engine;
    this.socketId = socketId;
    this.spot = spot;
    this.health = 3;
    this.power = 0.5;
    this.abilities = [];
    this.currentAbilities = [];

    let body = Matter.Bodies.circle(x, y, 30);
    body.label = "player";
    body.restitution = 1;
    body.friction = 0;
    body.frictionAir = 0.05;
    body.frictionStatic = 0;
    this.body = body;
    Matter.Body.setInertia(body, Infinity);
    Matter.World.add(engine.world, this.body);

    this.abilities.push(new BulletAbility(this));
    this.abilities.push(new WallAbility(this));

    if(settings){
      this.health = settings.health;
      this.power = settings.power;
      body.positionImpulse = settings.positionImpulse;
      Matter.Body.setVelocity(body, settings.velocity);
      Matter.Body.setAngle(body, settings.angle);
    }

    if(currentAbilities){
      this.addCurrentAbilities(currentAbilities);
    }

    if(abilities){
      for(let i in abilities){
        this.abilities[i].cooldownRemain = abilities[i].cooldownRemain;
      }
    }
  }

  addCurrentAbilities(currentAbilities){
    for(let ability of currentAbilities){
      this.addCurrentAbility(ability);
    }
  }

  addCurrentAbility(settings){
    // Bullet ability
    if(settings.id === 0){
      this.abilities[0].add(settings);
    }
    if(settings.id === 1){
      this.abilities[1].add(settings);
    }
  }

  hit(){
    this.health -= 1;
    if(this.health < 0) this.health = 0;
  }

  increasePower(){
    this.power += 0.01;
    if(this.power > 1) this.power = 1;
  }

  decreasePower(){
    this.power -= 0.01;
    if(this.power < 0) this.power = 0;
  }

  rotate(angle){
    Matter.Body.rotate(this.body, angle);
  }

  setAngle(angle){
    Matter.Body.setAngle(this.body, angle);
  }

  removeCurrentAbility(i){
    Matter.World.remove(this.engine.world, this.currentAbilities[i]);
    this.currentAbilities.splice(i, 1);
  }
}
