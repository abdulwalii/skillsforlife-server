import  {generateRandomId, generateString}  from "../genericFunctions.js";
import { fetchRandomJob } from "./jobController.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();


export const createRoom = async (req, res) => {
    try {
        const newRoom = await db.room.create({
            data: {
                id: generateString(8),
                name: req.body.roomName
            }
        });
        res.status(200).send({room: newRoom})
    } catch (error) {
        res.status(400).send({message: error.message }); 
    }
}

export const fetchRoom = async (req, res) => {
    try {
        if(req.params.id == undefined){
            return res.status(400).send({message: 'Room Id must be provided.'})
        }
        let room = await db.room.findUnique({
            where: {
                id: req.params.id
            }
        })
        if(room == null){
            return res.status(400).send({room: room})
        }
        res.status(200).send({room: room})

    } catch (error) {
        res.status(400).send({message: error.message }); 
        
    }
}

// export const createRoom = async (roomName, roomId) => {
//     try {
//         const newRoom = await db.room.create({
//             data: {
//                 id: roomId,
//                 name: roomName
//             }
//         });
//         return newRoom;
//     } catch (error) {
//         return error.message
//     }
// }

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

        let player = await db.player.findUnique({
            where: {
                id: data.playerId,
            },
            include: {
            }
        })

        // check if player joined previously

        let roomInitialAlreadyExist = await db.roomInitialInformation.findFirst({
            where: {
                playerId: data.playerId,
                roomId: data.roomId
            },
            include: {
                job: true
            }
        });

        if(roomInitialAlreadyExist != null) {

            return {player: player, job: roomInitialAlreadyExist.job, roomInitialInformation: roomInitialAlreadyExist};
            
        }
        
        // data contains playerId and roomId
        let randomJob = await fetchRandomJob();

        let newRoomInitialInformation = await db.roomInitialInformation.create({
            data: {
                id: generateRandomId('roomInitial_'),
                playerId: data.playerId,
                roomId: data.roomId,
                jobId: randomJob.id,
                moneyInTheBank: randomJob.netMonthlySalary
            }
        });
        let roomInitialInfo = await db.roomInitialInformation.findUnique({
            where: {
                id: newRoomInitialInformation.id
            },
            include: {
                job: true
            }
        })

        return {player: player, job: randomJob, roomInitialInformation: roomInitialInfo};
    } catch (error) {
        return error.message
    }
}

export const fetchRoomInformation = async (req, res) => {
    try {
        if(req.params.roomId == undefined){
            return res.status(400).send({message: 'Room Id must be provided.'})
        }

        let roomInitialInfo = await db.roomInitialInformation.findMany({
            where: {
                roomId: req.params.roomId
            },
            include: {
                job: true,
                room: true,
                player: true
            }
        });

        let roomInfo = await db.room.findUnique({
            where:{
                id: req.params.roomId
            }
        });

        res.status(200).send({roomInitialInfo: roomInitialInfo, roomInfo: roomInfo});

    } catch (error) {
        res.status(400).send({message: error.message }); 
        
    }
}