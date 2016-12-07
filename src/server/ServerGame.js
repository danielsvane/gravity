import Game from "../shared/Game";
import Player from "../shared/Player";
import Helper from "../shared/Helper";
import Matter from "matter-js";

export default class ServerGame extends Game {

  constructor(){
    super();
    this.nextSpot = 0;
    this.spot = 0;
  }

  addPlayer(socketId){
    let spot = this.spots[this.nextSpot];
    this.players.push(new Player(this.engine, spot.x, spot.y, this.nextSpot, socketId));
    return this.nextSpot++;
  }

  removePlayer(socketId){
    for(let i in this.players){
      let player = this.players[i];
      if(player.socketId === socketId){
        Matter.World.remove(this.engine.world, player.body);
        this.nextSpot = player.spot;
        this.players.splice(i, 1);
        return player.spot;
      }
    }
  }

  get state(){
    let stateObj = {};

    // Get state of players
    stateObj.players = [];
    for(let player of this.players){
      let playerObj = Helper.bodyState(player.body);
      playerObj.socketId = player.socketId;
      playerObj.bullets = [];

      for(let bullet of player.bullets){
        let bulletObj = Helper.bodyState(bullet);
        playerObj.bullets.push(bulletObj);
      }
      stateObj.players.push(playerObj);
    }

    console.log(stateObj);
  }

}
