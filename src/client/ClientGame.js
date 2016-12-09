import Game from "./../shared/Game";
import Player from "./../shared/Player";
import Matter from "matter-js";
export default class ClientGame extends Game {

  constructor(){
    super();
    this.render = Matter.Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        showAngleIndicator: true
      }
    });
  }

  step(){
    super.step();
    Matter.Render.world(this.render);
  }

  addPlayer(playerObj){
    let player = new Player(this.engine, playerObj.x, playerObj.y, 0, playerObj.socketId, playerObj.settings, playerObj.bullets);
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
    this.removePlayers();
    for(let playerObj of stateObj.players){
      this.addPlayer(playerObj);
    }
    console.log(Matter.Composite.allBodies(this.engine.world).length);
  }

}
