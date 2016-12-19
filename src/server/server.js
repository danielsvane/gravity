import http from "http";
import express from "express";
import path from "path";
import GameManager from "../server/GameManager";
import ioFactory from "socket.io";
import cluster from "cluster";
import os from "os";
import redis from "socket.io-redis";
import sticky from "sticky-cluster";

// console.log(cluster);
// console.log(os.cpus().length);

//cluster.schedulingPolicy = cluster.SCHED_RR;

sticky(function(callback){
  let app = express();
  let server = http.Server(app);
  let io = ioFactory(server);
  io.adapter(redis());
  let gm = new GameManager(io);

  app.use(express.static('dist'));

  //server.listen(process.env.PORT || 80);
  console.log("worker running: ", cluster.worker.id);

  app.get("/game/:id", function(req, res){
    console.log("connected to worker: ", cluster.worker.id);
    let id = req.params.id;
    gm.addGame(id);
    res.sendFile(path.resolve("sockettest.html"));
  });

  callback(server);
}, {
  concurrency: process.env.WEB_CONCURRENCY || os.cpus().length,
  port: process.env.PORT || 80,
  debug: true,
  env: function (index) { return { stickycluster_worker_index: index }; }
});


// if(cluster.isMaster){
//   for(let i = 0; i < os.cpus().length; i++) {
//     cluster.fork();
//   }
//
//   cluster.on("exit", function(worker){
//     console.log("worker died: ", worker.id);
//   });
//
// } else {
//   let app = express();
//   let server = http.Server(app);
//   let io = ioFactory(server);
//   io.adapter(redis());
//   let gm = new GameManager(io);
//
//   app.use(express.static('dist'));
//
//   server.listen(process.env.PORT || 80);
//   console.log("worker running: ", cluster.worker.id);
//
//   app.get("/game/:id", function(req, res){
//     console.log("connected to worker: ", cluster.worker.id);
//     let id = req.params.id;
//     gm.addGame(id);
//     res.sendFile(path.resolve("sockettest.html"));
//   });
// }
