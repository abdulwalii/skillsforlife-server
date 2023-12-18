import express from "express";
import { Server } from "socket.io";
import {createServer} from 'http';
import 'dotenv/config'


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    
});

io.on("connection", (socket) => {

});

httpServer.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});

