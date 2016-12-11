import Game from "../shared/Game";
import Player from "../shared/Player";
import Render from "../client/Render";
import Matter from "matter-js";
export default class ClientGame extends Game {

  constructor(){
    super();
    this.serverClientTimeDiff = 0;
    this.render = new Render(this);
    // this.render = Matter.Render.create({
    //   element: document.body,
    //   engine: this.engine,
    //   options: {
    //     showAngleIndicator: true
    //   }
    // });
  }

  // setupCollisionEvents(){
  //   super.setupCollisionEvents();
  //   Matter.Events.on(this.engine, "collisionStart", (e) => {
  //     let pair = e.pairs[0];
  //     let body;
  //     let bullet;
  //     if(pair.bodyA.label == "player" && pair.bodyB.label == "bullet"){
  //       body = pair.bodyA;
  //       bullet = pair.bodyB;
  //     }
  //     else if(pair.bodyB.label == "player" && pair.bodyA.label == "bullet"){
  //       body = pair.bodyB;
  //       bullet = pair.bodyA;
  //     }
  //     else return;
  //
  //     Matter.Body.setStatic(body, true);
  //   });
  // }

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

    this.removePlayers();
    for(let playerObj of stateObj.players){
      this.addPlayer(playerObj);
    }

    this.step();
    // Step game forward so it matches with server
    // let difference = this.serverClientTimeDiff-Date.now()+stateObj.time;
    // console.log("time difference", difference);
    // let steps = Math.round(difference/this.interval);
    // console.log("stepping ahead", steps, "times");
    // for(let i=0; i<steps; i++){
    //   this.step();
    // }
  }

}
