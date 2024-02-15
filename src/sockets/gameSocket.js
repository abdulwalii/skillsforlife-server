import { generateRandomId, generateString } from "../genericFunctions.js";
import {
    createRoom,
    findRoom,
    expireRoom,
    playerJoinedRoom,
    calculateScore,
} from "../controller/roomController.js";

import { getUser } from "../controller/authController.js";

export const gameSocket = (io) => {
    io.on("connection", (socket) => {
        
        // create room
        socket.on("createRoom", async (arg) => {
            const roomId = generateString(8);

            await createRoom(arg.roomName, roomId);
            socket.join(arg.roomName);

            const socketsInRoom = io.sockets.adapter.rooms.get(arg.roomName);
            console.log("Sockets in room:", socketsInRoom);

            let welcomeObj = {
                message: `Hi ${arg.userName}, Welcome to ${arg.roomName}`,
                roomId: roomId,
            };

            io.to(arg.roomName).emit("welcomeAdminRoom", welcomeObj);
        });

        // join room
        socket.on("joinRoom", async (data) => {
            let room = await findRoom(data.roomId);
            socket.join(room.name);

            const socketsInRoom = io.sockets.adapter.rooms.get(room.name);
            console.log("Sockets in room:", socketsInRoom);

            if (data.isAdmin) {
                let user = await getUser(data.playerId);

                let welcomeObj = {
                    message: `Hi ${user.userName}, Welcome to ${room.name}`,
                    roomId: room.id,
                    roomName: room.name,
                    room: room
                };

                io.to(room.name).emit("welcomeAdminRoom", welcomeObj);
            } else {
                let playerJoinedRoomInformation = await playerJoinedRoom(data);

                io.to(room.name).to(socket.id).emit("IJoined", playerJoinedRoomInformation);                
                io.to(room.name).emit("playerJoined", playerJoinedRoomInformation);
            }
        });

        // start Game

        socket.on('startGame', async(data) => {
            let room = await findRoom(data.roomId);
            io.to(room.name).emit('gameStart', true);
        })

        socket.on('endSession', async(data) => {
            let room = await findRoom(data.roomId);
            await expireRoom(data.roomId);
            await calculateScore(data.roomId)
            io.to(room.name).emit('gameOver', true);
        })

        // socket.on('endSession', async (data) => {
        //     const clientsInRoom = io.sockets.adapter.rooms.get(data.roomName);
        //     if (clientsInRoom) {
        //         // Iterate over each socket and remove them from the room
        //         clientsInRoom.forEach(clientId => {
        //             io.sockets.sockets.get(clientId).leave(data.roomName);
        //         });
        //     }
        //     console.log('clientsInRoom: ', clientsInRoom);
        // })
        

        // disconnet socket

        socket.on('disconnect', () => {
            // console.log(`Socket ${socket.id} disconnected`);
        });
    });
};
