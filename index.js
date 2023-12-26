import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';
import route from "./src/routes/routes.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(cors({
    origin: '*'
}));
app.use("/", route);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {

    // admin emit
    socket.on('fromAdmin', (data) => {
        console.log(data);
        io.emit("fromServer", "born");
    });

    socket.on("fromClient", (arg) => {
        io.emit("fromServer", "born");        
    })
});

httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
