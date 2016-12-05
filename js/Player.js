class Player {
  constructor(x, y, color, angle){
    this.lives = 3;
    this.color = color;
    this.power = 50;
    this.abilities = [];
    this.currentAbilityIndex = 0;

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

    this.addAbility(new NormalAbility());
    this.addAbility(new BigAbility());
  }

  addAbility(ability){
    this.abilities.push(ability);
  }

  fire(){
    this.currentAbility.fire();
    this.currentAbilityIndex = 0;
  }

  hit(){
    this.lives--;
    console.log(this.id);
    if(this.lives < 0){
      console.log("lol");
      World.remove(engine.world, this.body);
      for(var i in game.players){
        var player = game.players[i];
        if(player === this){
          game.players.splice(i, 1);
        }
      }
    }
  }

  get currentAbility(){
    return this.abilities[this.currentAbilityIndex];
  }
}
