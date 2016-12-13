export default class Ability {
  constructor(player){
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

    this.player.addBullet(x, y, velocity);
  }
}
