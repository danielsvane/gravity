import Matter from "matter-js";

export default class Player {
  constructor(engine, x, y, spot, socketId){
    this.engine = engine;
    this.socketId = socketId;
    this.spot = spot;
    this.body = Matter.Bodies.circle(x, y, 30);
    this.bullets = [];
    Matter.World.add(engine.world, this.body);
  }

  rotate(angle){
    Matter.Body.rotate(this.body, angle);
  }

  setAngle(angle){
    Matter.Body.setAngle(this.body, angle);
  }

  shoot(){
    let bulletRadius = 10;
    let body = this.body;
    let x = body.position.x+(body.circleRadius+bulletRadius)*Math.cos(body.angle);
    let y = body.position.y+(body.circleRadius+bulletRadius)*Math.sin(body.angle);
    let bullet = Matter.Bodies.circle(x, y, bulletRadius);

    let vel = {
      x: 10*Math.cos(body.angle),
      y: 10*Math.sin(body.angle)
    }

    //Matter.Body.setInertia(bullet, Infinity);
    Matter.Body.setVelocity(bullet, vel);

    // bullet.friction = 0.1;
    bullet.frictionAir = 0;
    // bullet.frictionStatic = 0;
    bullet.restitution = 1;

    Matter.World.add(this.engine.world, bullet);
    this.bullets.push(bullet);
  }
}
