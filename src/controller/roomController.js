import  {generateRandomId}  from "../genericFunctions.js";
import { fetchRandomJob } from "./jobController.js";
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

export const playerJoinedRoom = async (data) => {
    try {
        // data contains playerId and roomId
        let randomJob = await fetchRandomJob();
        const newRoomInitialInformation = await db.roomInitialInformation.create({
            data: {
                id: generateRandomId('roomInitial_'),
                playerId: data.playerId,
                roomId: data.roomId,
                jobId: randomJob.id,
                moneyInTheBank: randomJob.netMonthlySalary
            }
        });
        let player = db.player.findUnique({
            where: {
                id: data.playerId
            }
        })
        return {player: player, randomJob: randomJob, roomInitialInformation: newRoomInitialInformation};
    } catch (error) {
        return error.message
    }
}