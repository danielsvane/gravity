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
  }

  // start(){
  //   this.render();
  // }

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

  render(){

    let context = this.context;
    let canvas = this.canvas;
    let game = this.game;

    context.fillStyle = '#333';
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);


    // // Draw the abilities
    // if(game.currentPlayer){
    //   for(let [i, ability] of game.currentPlayer.abilities.entries()){
    //     if(i == game.currentPlayer.currentAbilityIndex){
    //       context.strokeStyle = "#999";
    //       context.lineWidth = 5;
    //     } else {
    //       context.strokeStyle = "#333";
    //       context.lineWidth = 1;
    //     }
    //     ability.render(context, 10, 10+110*i);
    //   }
    // }

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
      //console.log(game.players.length);

      context.fillStyle = color;

      for(let bullet of player.bullets){
        context.beginPath();
        context.arc(bullet.position.x, bullet.position.y, bullet.circleRadius, 2*Math.PI, false);
        context.fill();
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
