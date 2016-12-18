import Game from "../shared/Game";
import Player from "../shared/Player";
import Matter from "matter-js";

export default class ServerGame extends Game {

  constructor(io, gm, namespace){
    super();
    this.io = io;
    this.gm = gm;
    this.namespace = namespace;
    this.nextSpot = 0;
    this.spot = 0;
    this.steps = 0;

    this.setupIO(io);
  }

  setupIO(io){
    let game = this;
    io.on('connection', function (socket) {
      game.addPlayer(socket.client.id);
      io.emit("game state", game.getState());

      // For syncing unix time with client since they dont perfectly match (50ms off)
      socket.on("foo", function(clientTime){
        socket.emit("bar", clientTime, Date.now());
      });

      socket.on("player rotate", function(angle){
        let player = game.player(socket.client.id);
        player.rotate(angle);
        socket.broadcast.emit("player rotate", player.socketId, player.body.angle);
      });

      socket.on("player increase power", function(){
        let player = game.player(socket.client.id);
        player.increasePower();
        socket.broadcast.emit("player set power", player.socketId, player.power);
      });

      socket.on("player decrease power", function(){
        let player = game.player(socket.client.id);
        player.decreasePower();
        socket.broadcast.emit("player set power", player.socketId, player.power);
      });

      socket.on("use ability", function(index){
        let ability = game.player(socket.client.id).abilities[index];
        if(!ability.isOnCooldown()){
          ability.use();
          io.emit("game state", game.getState());
        }
      });

      socket.on("disconnect", function(){
        game.removePlayer(socket.client.id);
        if(game.players.length) io.emit("game state", game.getState());
        else game.gm.removeGame(game.namespace);
      });
    });
  }

  addPlayer(socketId){
    let spot = this.spots[this.nextSpot];
    let player = new Player(this.engine, spot.x, spot.y, this.nextSpot, socketId);
    this.players.push(player);
    this.nextSpot++;
    if(this.nextSpot > this.spots.length-1) this.nextSpot = 0;
  }

  removePlayer(socketId){
    for(let i in this.players){
      let player = this.players[i];
      if(player.socketId === socketId){
        for(let ability of player.currentAbilities){
          Matter.World.remove(this.engine.world, ability);
        }
        Matter.World.remove(this.engine.world, player.body);
        this.nextSpot = player.spot;
        this.players.splice(i, 1);
      }
    }
  }

  getState(){
    let stateObj = {};

    // Get state of players
    stateObj.players = [];
    for(let player of this.players){
      let playerObj = {
        socketId: player.socketId,
        x: player.body.position.x,
        y: player.body.position.y,
        spot: player.spot,
        settings: {
          power: player.power,
          health: player.health,
          positionImpulse: player.body.positionImpulse,
          velocity: player.body.velocity,
          angle: player.body.angle
        }
      }
      // Get state of player current abilities
      playerObj.currentAbilities = [];
      for(let ability of player.currentAbilities){
        let abilityObj = {
          id: ability.abilityId,
          x: ability.position.x,
          y: ability.position.y,
          angle: ability.angle,
          velocity: ability.velocity,
          time: ability.time
        }
        playerObj.currentAbilities.push(abilityObj);
      }

      // Get state of player abilities
      playerObj.abilities = [];
      for(let ability of player.abilities){
        let abilityObj = {
          cooldownRemain: ability.cooldownRemain
        }
        playerObj.abilities.push(abilityObj);
      }

      stateObj.players.push(playerObj);
    }

    stateObj.time = Date.now();

    return stateObj;
  }

}
