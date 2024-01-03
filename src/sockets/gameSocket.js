import { generateRandomId, generateString } from "../genericFunctions.js";
import {
    createRoom,
    findRoom,
    playerJoinedRoom,
} from "../controller/roomController.js";

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

            let playerJoinedRoomInformation = await playerJoinedRoom(data);

            io.to(room.name).emit("playerJoined", playerJoinedRoomInformation);
        });

        // disconnet socket

        socket.on('disconnect', () => {
            console.log(`Socket ${socket.id} disconnected`);
        });
    });
};
