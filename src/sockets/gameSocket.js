import  {generateRandomId}  from "../genericFunctions.js";
import {createRoom, findRoom, playerJoinedRoom} from '../controller/roomController.js'

export const gameSocket = (io) => {

    io.on("connection", (socket) => {

        // create room
        socket.on("createRoom", (roomName) => {

            const roomId = generateString(8);

            createRoom(roomName, roomId);

            socket.join(roomName);
            socket.emit("roomCreated", roomId);

        });

        // join room
        socket.on('joinRoom', async (data) => {

            let room = findRoom(data.roomId);
            socket.join(room.name);

            let playerJoinedRoomInformation = await playerJoinedRoom(data)
            socket.emit('roomJoined', playerJoinedRoomInformation)

            io.to(room.name).emit('playerJoinedAdmin', playerJoinedRoomInformation)
        })
    });

}