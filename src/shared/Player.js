import Matter from "matter-js";

export default class Player {
  constructor(engine, x, y, spot, socketId, settings = undefined, bullets = undefined){
    this.engine = engine;
    this.socketId = socketId;
    this.spot = spot;
    this.bullets = [];

    let body = Matter.Bodies.circle(x, y, 30);
    body.label = "player";
    body.restitution = 1;
    body.friction = 0;
    body.frictionAir = 0.05;
    body.frictionStatic = 0;

    Matter.Body.setInertia(body, Infinity);

    if(settings){
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

  addBullets(bulletsObj){
    for(let bulletObj of bulletsObj){
      this.addBullet(bulletObj.x, bulletObj.y, bulletObj.velocity);
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

  addBullet(x, y, velocity){
    let bulletRadius = 10;
    let bullet = Matter.Bodies.circle(x, y, bulletRadius, {
      label: "bullet",
      frictionAir: 0,
      restitution: 1
    });

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
      x: 7*Math.cos(body.angle),
      y: 7*Math.sin(body.angle)
    }

    this.addBullet(x, y, velocity);
  }
}
