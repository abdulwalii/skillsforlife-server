import  {generateRandomId}  from "../genericFunctions.js";
import {createRoom, findRoom} from '../controller/roomController.js'

export const gameSocket = (io) => {

    io.on("connection", (socket) => {

        // create room
        socket.on("createRoom", (roomName) => {

            const roomId = generateRandomId('room_');

            createRoom(roomName, roomId);

            socket.join(roomName);
            socket.emit("roomCreated", roomId);

        });

        // join room
        socket.on('joinRoom', (roomId) => {

            let room = findRoom(roomId);
            socket.join(room.name);
            
            io.to(room.name).emit('')
        })
    });

}