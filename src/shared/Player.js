import Matter from "matter-js";

export default class Player {
  constructor(engine, x, y){
    this.body = Matter.Bodies.circle(x, y, 30);
    Matter.World.add(engine.world, this.body);
  }

  rotate(angle){
    Matter.Body.rotate(this.body, angle);
  }
}
