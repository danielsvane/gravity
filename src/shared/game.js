import Matter from "matter-js";

export default class Game {
  constructor(){
    this.engine = Matter.Engine.create();
    this.stepInterval = undefined;
    this.foo = "bar";

    let boxA = Matter.Bodies.circle(100, 300, 30);
    let boxB = Matter.Bodies.circle(400, 300, 150, {isStatic: true});
    Matter.World.add(this.engine.world, [boxA, boxB]);
  }

  start(){
    stepInterval = setInterval(step, 1000/30);
  }

  pause(){

  }

  step(){
    Matter.Engine.update(this.engine);
    //Matter.Render.world(render);
  }
}
