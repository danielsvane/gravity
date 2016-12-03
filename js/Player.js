class Player {
  constructor(x, y, color, angle){
    this.lives = 5;
    this.color = color;
    this.power = 50;

    var body = Bodies.circle(x, y, 20, {
      collisionFilter: {
        category: 0x0001
      }
    });
    body.label = "player";
    //player.restitution = 1;
    //Body.setInertia(body, Infinity);
    Body.setAngle(body, angle);
    //Body.setStatic(body, true);
    body.restitution = 1;
    body.friction = 0;
    body.frictionAir = 0.05;
    body.frictionStatic = 0;
    //Body.setMass(player, 1);
    World.add(engine.world, body);
    this.body = body;
  }
}
