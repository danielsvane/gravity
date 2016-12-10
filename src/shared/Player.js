import Matter from "matter-js";

export default class Player {
  constructor(engine, x, y, spot, socketId, settings = undefined, bullets = undefined){
    this.engine = engine;
    this.socketId = socketId;
    this.spot = spot;
    this.health = 3;
    this.power = 0.5;
    this.bullets = [];

    let body = Matter.Bodies.circle(x, y, 30);
    body.label = "player";
    body.restitution = 1;
    body.friction = 0;
    body.frictionAir = 0.05;
    body.frictionStatic = 0;

    Matter.Body.setInertia(body, Infinity);

    if(settings){
      this.health = settings.health;
      this.power = settings.power;
      body.positionImpulse = settings.positionImpulse;
      Matter.Body.setVelocity(body, settings.velocity);
      Matter.Body.setAngle(body, settings.angle);
    }

    this.body = body;
    Matter.World.add(engine.world, this.body);

    if(bullets){
      this.addBullets(bullets);
    }
  }

  hit(){
    this.health -= 1;
    if(this.health < 0) this.health = 0;
  }

  increasePower(){
    this.power += 0.05;
    if(this.power > 1) this.power = 1;
  }

  decreasePower(){
    this.power -= 0.05;
    if(this.power < 0) this.power = 0;
  }

  addBullets(bulletsObj){
    for(let bulletObj of bulletsObj){
      this.addBullet(bulletObj.x, bulletObj.y, bulletObj.velocity, bulletObj.time);
    }
  }

  rotate(angle){
    Matter.Body.rotate(this.body, angle);
  }

  setAngle(angle){
    Matter.Body.setAngle(this.body, angle);
  }

  removeBullet(i){
    Matter.World.remove(this.engine.world, this.bullets[i]);
    this.bullets.splice(i, 1);
  }

  addBullet(x, y, velocity, time = 400){
    let bulletRadius = 10;
    let bullet = Matter.Bodies.circle(x, y, bulletRadius, {
      label: "bullet",
      frictionAir: 0,
      restitution: 0.9,
      collisionFilter: {
        category: 0x0001,
        mask: 0x0001
      }
    });

    bullet.time = time;

    Matter.Body.setInertia(bullet, Infinity);
    Matter.Body.setVelocity(bullet, velocity);
    Matter.World.add(this.engine.world, bullet);
    this.bullets.push(bullet);
  }

  shoot(){
    let bulletRadius = 10;
    let body = this.body;
    let x = body.position.x+(body.circleRadius+bulletRadius)*Math.cos(body.angle);
    let y = body.position.y+(body.circleRadius+bulletRadius)*Math.sin(body.angle);
    let velocity = {
      x: this.power*20*Math.cos(body.angle),
      y: this.power*20*Math.sin(body.angle)
    }

    this.addBullet(x, y, velocity);
  }
}
