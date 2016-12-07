import Game from "../shared/Game";
import Player from "../shared/Player";
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


}
