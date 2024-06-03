import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import * as https from 'https';
import cors from "cors";
import route from "./src/routes/routes.js";
import { gameSocket } from "./src/sockets/gameSocket.js";
import "dotenv/config";
import fs from 'node:fs';

const app = express();

app.use(express.json());
app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: false }));
// app.use(cors({ origin: "*" }));
app.use(cors());
app.use("/", route);

let isProduction = process.env.NODE_ENV == 'production' ? true : false;
let httpServer = null;

if(isProduction){
    let opt = {
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('cert.pem')
    }
    // let opt = {
    //     key: fs.readFileSync('/etc/letsencrypt/live/skillforlifeapp.com/privkey.pem'),
    //     cert: fs.readFileSync('/etc/letsencrypt/live/skillforlifeapp.com/fullchain.pem')
    // }
    httpServer = https.createServer(opt, app);
    
 }else{
    httpServer = createServer(app);
 }

// httpServer = createServer(app);

const io = new Server(httpServer, {   
    cors: { 
        origin: '*'
    } 
});

// console.log(io);

gameSocket(io);

httpServer.listen(process.env.PORT,'0.0.0.0', () => {
    console.log(`Listening on port ${process.env.PORT}, ${isProduction}`);
});
