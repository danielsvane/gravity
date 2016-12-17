import Game from "../shared/Game";
import Player from "../shared/Player";
import Render from "../client/Render";
import Matter from "matter-js";
export default class ClientGame extends Game {

  constructor(){
    super();
    this.serverClientTimeDiff = 0;
    this.render = new Render(this);
  }

  step(){
    super.step();
    this.render.render();
  }

  addPlayer(playerObj){
    let player = new Player(
      this.engine,
      playerObj.x,
      playerObj.y,
      playerObj.spot,
      playerObj.socketId,
      playerObj.settings,
      playerObj.currentAbilities,
      playerObj.abilities
    );
    this.players.push(player);
  }

  removePlayers(){
    for(let player of this.players){
      for(let ability of player.currentAbilities){
        Matter.World.remove(this.engine.world, ability);
      }
      player.currentAbilities.length = 0;
      Matter.World.remove(this.engine.world, player.body);
    }
    this.players.length = 0;
  }

  setState(stateObj){
    this.removePlayers();
    for(let playerObj of stateObj.players){
      this.addPlayer(playerObj);
    }
    
    // Step game forward so it matches with server
    let difference = Date.now()-stateObj.time-this.serverClientTimeDiff;
    //console.log("time difference", difference);
    let steps = Math.round(difference/this.interval);
    //console.log("stepping ahead", steps, "times");
    for(let i=0; i<steps; i++){
        this.step();
    }
  }

}
