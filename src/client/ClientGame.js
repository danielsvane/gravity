import Game from "../shared/Game";
import Player from "../shared/Player";
import Render from "../client/Render";
import Matter from "matter-js";
export default class ClientGame extends Game {

  constructor(){
    super();
    this.render = new Render(this);
    // this.render = Matter.Render.create({
    //   element: document.body,
    //   engine: this.engine,
    //   options: {
    //     showAngleIndicator: true
    //   }
    // });
  }

  step(){
    super.step();
    this.render.render();
    //Matter.Render.world(this.render);
  }

  addPlayer(playerObj){
    let player = new Player(this.engine, playerObj.x, playerObj.y, playerObj.spot, playerObj.socketId, playerObj.settings, playerObj.bullets);
    this.players.push(player);
  }

  removePlayers(){
    for(let player of this.players){
      for(let bullet of player.bullets){
        Matter.World.remove(this.engine.world, bullet);
      }
      player.bullets.length = 0;
      Matter.World.remove(this.engine.world, player.body);
    }
    this.players.length = 0;
  }

  setState(stateObj){
    console.log("time difference", stateObj.time-Date.now());

    this.removePlayers();
    for(let playerObj of stateObj.players){
      this.addPlayer(playerObj);
    }
  }

}
