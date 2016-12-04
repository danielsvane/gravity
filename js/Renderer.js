class Renderer {
  init(){
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.scaleFactor = 0.05;

    var canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    document.body.appendChild(canvas);

    this.resize();
  }

  resize(){
    var gameRatio = game.width/game.height;
    var windowRatio = window.innerWidth/window.innerHeight;
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

  start(){
    this.render();
  }

  zoomIn(){
    this.zoom(this.scaleFactor);
  }

  zoomOut(){
    this.zoom(-this.scaleFactor);
  }

  zoom(value){
    this.scale *= (1+value);
    var width = this.canvas.width/2;
    var height = this.canvas.height/2;
    var offsetX = this.offsetX;
    var offsetY = this.offsetY;
    var scale = 1+value;
    this.offsetX = width-(width-offsetX)*scale;
    this.offsetY = height-(height-offsetY)*scale;
  }

  setOffset(x, y){
    this.offsetX += x;
    this.offsetY += y;
  }

  render(){
    window.requestAnimationFrame(this.render.bind(this));

    var context = this.context;
    var canvas = this.canvas;

    context.fillStyle = '#333';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

    context.fillStyle = "#363636";
    for(var bound of game.bounds){
      context.beginPath();
      context.moveTo(bound.vertices[0].x, bound.vertices[0].y);
      for(var point of bound.vertices){
        context.lineTo(point.x, point.y);
      }
      context.fill();
    }

    if(game.bullet){
      // Draw the bullet
      var bullet = game.bullet;
      context.fillStyle = game.currentPlayer.color;
      context.beginPath();
      context.arc(bullet.position.x, bullet.position.y, bullet.circleRadius, 2*Math.PI, false);
      context.fill();

      // Draw bullet bar
      context.fillStyle = "#222";
      context.beginPath();
      context.fillRect(10, game.height-20, (game.width-20)*game.bulletProgress, 10);
    } else {
      // Draw think bar
      context.fillStyle = "#222";
      context.beginPath();
      context.fillRect(10, game.height-20, (game.width-20)*game.thinkProgress, 10);
    }

    for(var planet of game.planets){
      // Draw the planet
      context.fillStyle = "#999";
      context.beginPath();
      context.arc(planet.position.x, planet.position.y, planet.circleRadius, 2*Math.PI, false);
      context.fill();
    }

    for(var player of game.players){
      var body = player.body;
      // Draw the circle body
      context.fillStyle = player.color;
      context.beginPath();
      context.arc(body.position.x, body.position.y, body.circleRadius, 2*Math.PI, false);
      context.fill();

      // Draw the angle indicator
      context.beginPath();
      context.strokeStyle = "#333";
      context.lineWidth = 5;
      context.lineCap = "round";
      var scale = (100-player.power)/100;
      var startX = body.position.x+body.circleRadius*Math.cos(body.angle)*scale;
      var startY = body.position.y+body.circleRadius*Math.sin(body.angle)*scale;
      var endX = body.position.x+body.circleRadius*Math.cos(body.angle);
      var endY = body.position.y+body.circleRadius*Math.sin(body.angle);
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();

      // Lives indicator
      context.strokeStyle = player.color;
      context.lineWidth = 2;
      if(player === game.currentPlayer) context.globalAlpha = 1;
      else context.globalAlpha = 0.5;
      for(var i=0; i<player.lives-2; i++){
        context.beginPath();
        context.arc(body.position.x, body.position.y, body.circleRadius+4*(i+1)-1, 2*Math.PI, false);
        context.stroke();
      }
      context.globalAlpha = 1;
    }

    context.restore();
  }
}
