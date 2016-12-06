import Game from "../shared/Game";
import Matter from "matter-js";
import io from "socket.io-client";

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
    this.addEvents();
    this.setupIO();
  }

  setupIO(){
    this.socket = io("http://localhost");
  }

  step(){
    super.step();
    Matter.Render.world(this.render);
  }

  addEvents(){
    document.addEventListener("keydown", this.handleKeyboardEvents.bind(this));
  }

  handleKeyboardEvents(e){
    if(e.key === "ArrowLeft"){
      this.players[0].rotate(-Math.PI/30);
      this.socket.emit("rotated", -Math.PI/30);
    }
    if(e.key === "ArrowRight"){
      this.players[0].rotate(Math.PI/30);
    }
  }

}
