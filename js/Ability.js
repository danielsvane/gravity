class Ability {
  constructor(){
    this.cooldownRemain = 0;
  }
  decreaseCooldown(){
    if(this.cooldownRemain > 0) this.cooldownRemain--;
  }
  putOnCooldown(){
    this.cooldownRemain = this.cooldown;
  }
  render(context, x, y){
    if(this.isOnCooldown) context.globalAlpha = 0.3;
    this.renderBackground(context, x, y);
    this.renderAbility(context, x, y);
    context.globalAlpha = 1;
    if(this.isOnCooldown) this.renderCooldown(context, x, y);
  }
  renderBackground(context, x, y){
    context.fillStyle = '#222';
    context.beginPath();
    context.rect(x, y, 100, 100);
    context.fill();
    context.stroke();
  }
  renderCooldown(context, x, y){
    context.fillStyle = "#999";
    context.font = "40px arial";
    context.textAlign = "center";
    context.beginPath();
    context.fillText(this.cooldownRemain, x+50, y+63);
  }
  get isOnCooldown(){
    return (this.cooldownRemain > 0);
  }
}

class NormalAbility extends Ability {
  constructor(){
    super();
    this.cooldown = 0;
  }
  renderAbility(context, x, y){
    context.fillStyle = game.currentPlayer.color;
    context.beginPath();
    context.arc(x+50, y+50, 10, 2*Math.PI, false);
    context.fill();
  }
  fire(){
    game.addBullet();
    this.putOnCooldown();
  }
}

class BigAbility extends Ability {
  constructor(){
    super();
    this.cooldown = 2;
  }
  renderAbility(context, x, y){
    context.fillStyle = game.currentPlayer.color;
    context.beginPath();
    context.arc(x+50, y+50, 30, 2*Math.PI, false);
    context.fill();
  }
  fire(){
    game.addBullet(30);
    this.putOnCooldown();
  }
}
