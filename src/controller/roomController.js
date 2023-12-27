import  {generateRandomId}  from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const createRoom = async (roomName, roomId) => {
    try {
        const newRoom = await db.room.create({
            data: {
                id: roomId,
                name: roomName
            }
        });
        return newRoom;
    } catch (error) {
        return error.message
    }
}

export const findRoom = async (roomId) => {
    try {
        const room = await db.room.findUnique({
            where: {
                id: roomId
            }
        });
        return room
    } catch (error) {
        return error.message
    }
}