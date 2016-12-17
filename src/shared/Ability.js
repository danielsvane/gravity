import Matter from "matter-js";

export class BulletAbility {
  constructor(player){
    this.id = 0;
    this.duration = 500;
    this.cooldown = 150;
    this.cooldownRemain = 0;
    this.player = player;
  }

  decreaseCooldown(){
    this.cooldownRemain--;
    if(this.cooldownRemain < 0) this.cooldownRemain = 0;
  }

  isOnCooldown(){
    return this.cooldownRemain;
  }

  putOnCooldown(){
    this.cooldownRemain = this.cooldown;
  }

  use(){
    this.putOnCooldown();

    let bulletRadius = 10;
    let body = this.player.body;
    let power = this.player.power;
    let x = body.position.x+(body.circleRadius+bulletRadius)*Math.cos(body.angle);
    let y = body.position.y+(body.circleRadius+bulletRadius)*Math.sin(body.angle);
    let velocity = {
      x: power*20*Math.cos(body.angle),
      y: power*20*Math.sin(body.angle)
    }

    this.add({
      id: this.id,
      x: x,
      y: y,
      velocity: velocity,
      time: this.duration,
    });
  }

  add(settings){
    let x = settings.x;
    let y = settings.y;
    let velocity = settings.velocity;
    let time = settings.time;

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
    bullet.abilityId = 0;

    Matter.Body.setInertia(bullet, Infinity);
    Matter.Body.setVelocity(bullet, velocity);
    Matter.World.add(this.player.engine.world, bullet);
    this.player.currentAbilities.push(bullet);
  }
}

export class WallAbility {
  constructor(player){
    this.id = 1;
    this.duration = 500;
    this.cooldown = 150;
    this.cooldownRemain = 0;
    this.player = player;
  }

  decreaseCooldown(){
    this.cooldownRemain--;
    if(this.cooldownRemain < 0) this.cooldownRemain = 0;
  }

  isOnCooldown(){
    return this.cooldownRemain;
  }

  putOnCooldown(){
    this.cooldownRemain = this.cooldown;
  }

  use(){
    this.putOnCooldown();

    let distance = 80;
    let body = this.player.body;
    let power = this.player.power;
    let x = body.position.x+(body.circleRadius+distance)*Math.cos(body.angle);
    let y = body.position.y+(body.circleRadius+distance)*Math.sin(body.angle);

    this.add({
      id: this.id,
      x: x,
      y: y,
      angle: body.angle,
      time: this.duration,
    });
  }

  add(settings){
    let x = settings.x;
    let y = settings.y;
    let time = settings.time;

    let wall = Matter.Bodies.rectangle(x, y, 40, 200, {
      label: "bullet",
      isStatic: true,
      angle: settings.angle
    });

    wall.time = time;
    wall.abilityId = this.id;

    Matter.Body.setInertia(wall, Infinity);
    Matter.World.add(this.player.engine.world, wall);
    this.player.currentAbilities.push(wall);
  }
}
