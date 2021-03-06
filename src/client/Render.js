export default class Renderer {
  constructor(game){
    this.game = game;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.scaleFactor = 0.05;

    let canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    document.body.appendChild(canvas);

    this.resize();
  }

  resize(){
    let game = this.game;
    let gameRatio = game.width/game.height;
    let windowRatio = window.innerWidth/window.innerHeight;
    if(gameRatio > windowRatio){
      this.scale = window.innerWidth/game.width;
    } else {
      this.scale = window.innerHeight/game.height;
    }
    this.offsetX = (window.innerWidth-game.width*this.scale)/2;
    this.offsetY = (window.innerHeight-game.height*this.scale)/2;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.zoom(-0.2);
  }

  zoomIn(){
    this.zoom(this.scaleFactor);
  }

  zoomOut(){
    this.zoom(-this.scaleFactor);
  }

  zoom(value){
    this.scale *= (1+value);
    let width = this.canvas.width/2;
    let height = this.canvas.height/2;
    let offsetX = this.offsetX;
    let offsetY = this.offsetY;
    let scale = 1+value;
    this.offsetX = width-(width-offsetX)*scale;
    this.offsetY = height-(height-offsetY)*scale;
  }

  setOffset(x, y){
    this.offsetX += x;
    this.offsetY += y;
  }

  normalizeAngle(angle){
    angle = Math.round(180/Math.PI*angle);
    angle = -angle%360;
    if(angle < 0) angle += 360;
    return angle;
  }

  render(){

    let context = this.context;
    let canvas = this.canvas;
    let game = this.game;

    context.fillStyle = '#333';
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw angle and power info
    if(game.currentPlayer){
      context.fillStyle = "#222";
      context.font = "20px arial";
      context.beginPath();
      context.fillText("Angle: " + this.normalizeAngle(game.currentPlayer.body.angle) + "°", 10, 30);
      context.fill();
      context.beginPath();
      context.fillText("Power: " + Math.round(game.currentPlayer.power*100) + "%", 10, 60);
      context.fill();
    }

    // Draw the ability cooldowns
    if(game.currentPlayer){
      let q = game.currentPlayer.abilities[0];
      context.beginPath();
      context.fillText("Q: " + q.cooldownRemain, 10, 90);
      context.fill();

      let w = game.currentPlayer.abilities[1];
      context.beginPath();
      context.fillText("W: " + w.cooldownRemain, 10, 120);
      context.fill();
    }

    context.save();
    context.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

    context.fillStyle = "#363636";
    for(let bound of game.bounds){
      context.beginPath();
      context.moveTo(bound.vertices[0].x, bound.vertices[0].y);
      for(let point of bound.vertices){
        context.lineTo(point.x, point.y);
      }
      context.fill();
    }

    context.fillStyle = "#999";
    for(let planet of game.planets){
      // Draw the planet
      context.beginPath();
      context.arc(planet.position.x, planet.position.y, planet.circleRadius, 2*Math.PI, false);
      context.fill();
    }

    for(let player of game.players){

      let body = player.body;
      let color = game.spots[player.spot].color;

      context.fillStyle = color;

      for(let ability of player.currentAbilities){
        player.abilities[ability.abilityId].render(ability, context);
      }

      // Draw the circle body
      context.beginPath();
      context.arc(body.position.x, body.position.y, body.circleRadius, 2*Math.PI, false);
      context.fill();

      // Draw the angle indicator
      context.beginPath();
      context.strokeStyle = "#333";
      context.lineWidth = 5;
      context.lineCap = "round";
      let scale = 1-player.power;
      let startX = body.position.x+body.circleRadius*Math.cos(body.angle)*scale;
      let startY = body.position.y+body.circleRadius*Math.sin(body.angle)*scale;
      let endX = body.position.x+body.circleRadius*Math.cos(body.angle);
      let endY = body.position.y+body.circleRadius*Math.sin(body.angle);
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();

      // Lives indicator

      context.globalAlpha = 0.3;
      context.beginPath();
      context.arc(body.position.x, body.position.y, body.circleRadius+5*player.health, 2*Math.PI, false);
      context.fill();
      context.globalAlpha = 1;

    }

    context.restore();
  }
}
