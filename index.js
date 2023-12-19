import express from "express";
import { Server } from "socket.io";
import {createServer} from 'http';
import route from "./src/routes/routes.js";
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ 
    extended: false
}));


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
      }
});

io.on("connection", (socket) => {
    
    console.log("what is socket: ", socket.id);
    
    socket.emit("message", "hello from server");

});
app.use('/', route);
httpServer.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});

