import  {generateRandomId, generateString}  from "../genericFunctions.js";
import {createRoom, findRoom, playerJoinedRoom} from '../controller/roomController.js'

export const gameSocket = (io) => {

    io.on("connection", (socket) => {

        // create room
        socket.on("createRoom", (arg) => {
            
            const roomId = generateString(8);
            
            createRoom(arg.roomName, roomId);            
            socket.join(arg.roomName);
            
            let welcomeObj = {
                message: `Hi ${arg.userName}, Welcome to ${arg.roomName}`,
                roomId: roomId
            }
            io.to(arg.roomName).emit('welcomeRoom', welcomeObj)

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