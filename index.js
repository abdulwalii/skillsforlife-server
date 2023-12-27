import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import route from "./src/routes/routes.js";
import {gameSocket} from "./src/sockets/gameSocket.js";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin: "*"}));
app.use("/", route);

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: "*",}});

gameSocket(io);

httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
