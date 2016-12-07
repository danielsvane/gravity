import Game from "../shared/Game";
import Player from "../shared/Player";
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

  addPlayer(spotIndex, socketId){
    let spot = this.spots[spotIndex];
    this.players.push(new Player(this.engine, spot.x, spot.y, spotIndex, socketId));
  }

  removePlayer(spot){
    for(let i in this.players){
      let player = this.players[i];
      if(player.spot === spot){
        Matter.World.remove(this.engine.world, player.body);
        this.players.splice(i, 1);
      }
    }
  }

}
