(function(exports){
  exports.Game = class Game {
    constructor(Matter, isClient = false){
      this.Matter = Matter;
      this.engine = Matter.Engine.create();
      this.stepInterval = undefined;

      var boxA = Matter.Bodies.circle(100, 300, 30);
      var boxB = Matter.Bodies.circle(400, 300, 150, {isStatic: true});
      Matter.World.add(engine.world, [boxA, boxB]);
    }

    start(){
      stepInterval = setInterval(step, 1000/30);
    }

    pause(){

    }

    step(){
      Matter.Engine.update(engine);
      Matter.Render.world(render);
    }
  }
})(typeof exports === 'undefined'? this['Gravity']={}: exports);
