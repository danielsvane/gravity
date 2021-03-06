import Game from "../server/ServerGame";

export default class GameManager {
  constructor(io){
    this.io = io;
    this.games = {};
  }

  addGame(namespace){
    if(!this.games[namespace]){
      let ns = this.io.of("/"+namespace);
      let game = new Game(ns, this, namespace);

      this.games[namespace] = game;
      game.start();

      console.log("added game: ", namespace);
    }
  }

  removeGame(namespace){
    delete this.games[namespace];
    delete this.io.nsps["/"+namespace];
    console.log("removed game: ", namespace);
    //console.log(this.io);
  }
}
