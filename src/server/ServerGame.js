import Game from "../shared/Game";
import Player from "../shared/Player";
import Matter from "matter-js";

export default class ServerGame extends Game {

  constructor(io){
    super();
    this.io = io;
    this.nextSpot = 0;
    this.spot = 0;
    this.steps = 0;
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
        for(let bullet of player.bullets){
          Matter.World.remove(this.engine.world, bullet);
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
      // Get state of player bullets
      playerObj.bullets = [];
      for(let bullet of player.bullets){
        let bulletObj = {
          x: bullet.position.x,
          y: bullet.position.y,
          velocity: bullet.velocity,
          time: bullet.time
        }
        playerObj.bullets.push(bulletObj);
      }

      stateObj.players.push(playerObj);
    }

    return stateObj;
  }

}
