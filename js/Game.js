class Game {
  constructor(width, height){
    this.players = [];
    this.planets = [];
    this.bounds = [];
    this.currentPlayerIndex = 0;
    this.bulletTime = 0;
    this.bulletTimeLimit = 500;
    this.thinkTime = 0;
    this.thinkTimeLimit = 1000;
    this.width = width;
    this.height = height;

    this.createBounds();
  }

  createBounds(){
    this.createBound(5, this.height/2, 10, this.height);
    this.createBound(this.width/2, 5, this.width, 10);
    this.createBound(this.width-5, this.height/2, 10, this.height);
    this.createBound(this.width/2, this.height-5, this.width, 10);
  }

  createBound(x, y, width, height){
    var bound = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      collisionFilter: {
        category: 0x0002
      }
    });

    World.add(engine.world, bound);
    this.bounds.push(bound);
  }

  addPlanet(x, y, radius){
    var planet = Bodies.circle(x, y, radius, {
      collisionFilter: {
        category: 0x0001
      }
    });
    Body.setStatic(planet, true);
    planet.restitution = 1;
    planet.friction = 0.05;
    planet.frictionAir = 0;
    planet.frictionStatic = 0;
    World.add(engine.world, planet);
    this.planets.push(planet);
  }

  addPlayer(x, y, color = "#fff", angle = 0){
    this.players.push(new Player(x, y, color, angle));
  }

  addBullet(){
    if(!this.bullet){
      var bulletRadius = 10;
      var player = this.currentPlayer;
      var body = player.body;
      var x = body.position.x+(body.circleRadius+bulletRadius)*Math.cos(body.angle);
      var y = body.position.y+(body.circleRadius+bulletRadius)*Math.sin(body.angle);
      var bullet = Bodies.circle(x, y, bulletRadius, {
        collisionFilter: {
          category: 0x0001,
          mask: 0x0001
        }
      });

      Body.setInertia(bullet, Infinity);
      //Body.setMass(bullet, 40);
      var vel = {
        x: 0.2*player.power*Math.cos(body.angle),
        y: 0.2*player.power*Math.sin(body.angle)
      }

      Body.setVelocity(bullet, vel);

      Body.setVelocity(player.body, Vector.neg(vel));

      bullet.friction = 0.1;
      bullet.frictionAir = 0;
      bullet.frictionStatic = 0;
      bullet.restitution = 1;
      bullet.label = "bullet";
      //Body.applyForce(bullet, {x: 0, y: 0}, {x: 0.01, y: 0.00});
      World.add(engine.world, bullet);
      this.bullet = bullet;
    }
  }

  get currentPlayer(){
    return this.players[this.currentPlayerIndex];
  }

  removeBullet(){
    World.remove(engine.world, this.bullet);
    this.bullet = undefined;
  }

  nextPlayer(){
    if(this.currentPlayerIndex < this.players.length-1){
      this.currentPlayerIndex++;
    } else {
      this.currentPlayerIndex = 0;
    }
  }

  increasePower(){
    var player = this.currentPlayer;
    player.power = player.power+10;
    if(player.power > 100) player.power = 100;
  }

  decreasePower(){
    var player = this.currentPlayer;
    player.power = player.power-10;
    if(player.power < 0) player.power = 0;
  }

  endTurn(){
    if(this.bullet) this.removeBullet();
    this.nextPlayer();
    this.bulletTime = 0;
    this.thinkTime = 0;
  }

  get thinkProgress(){
    return this.thinkTime/this.thinkTimeLimit;
  }

  get bulletProgress(){
    return this.bulletTime/this.bulletTimeLimit;
  }
}
