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
                id: req.params.id,
                isActive: true
            }
        })
        if(room == null){
            return res.status(400).send({room: room, message: "Session Id Expired."})
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
                // isActive: true
            }
        });
        return room
    } catch (error) {
        return error.message
    }
}
export const expireRoom = async (roomId) => {
    try {
        let roomUpdated = await db.room.update({
            where: {
                id: roomId
            },
            data: {
                isActive: false
            }
        })
        return roomUpdated
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

export const calculateScore = async (roomId) => {

    try {
        // const {roomId} = req.body;
        let playerIds = [];
        let score = null;

        // find all players in the room
        let playersInfo = await db.roomInitialInformation.findMany({
            where:{
                roomId: roomId
            },
            select: {
                id: true,
                playerId: true,
                moneyInTheBank: true
            }
        })

        // push playerids in an array
        playersInfo.forEach((player) => playerIds.push(player.playerId));

        // find player's purchases excluded refunds
        let roomStationInfo = await db.roomStationInformation.findMany({
            where: {
                playerId: {in: playerIds},
                roomId: roomId,
                refunded: false,
            },
        })

        // iterate playersinfo
        playersInfo.forEach(async (player) => {

            // filter player's purchases from all purchases in a room
            let info = roomStationInfo.filter((data) => data.playerId == player.playerId);
            score = player.moneyInTheBank;
            
            info.forEach((data) => { // iterate those purchases

                if(data.growth > 0){ // check if player buys investment account

                    score = player.moneyInTheBank * 1.1; // add 10% of their remaining money in their money.
                    return;

                }
            })            
            
            // await db.roomInitialInformation.update({
            //     where:{
            //         id: player.id
            //     },
            //     data: {
            //         moneyInTheBank: score
            //     }
            // })

            await db.score.create({
                data: {
                    id: generateRandomId('score_'),
                    roomId: roomId,
                    playerId: player.playerId,
                    score: score
                }
            })

            score = null;

        })        

        return `Scores Calculated Successfully.`

    } catch (error) {
        return error.message
    }
}

export const getMyScore = async (req, res) => {
    try {
        const {playerId, roomId} = req.body;

        let score = await db.score.findFirst({
            where: {
                playerId: playerId,
                roomId:roomId
            },
            include: {
                room: true,
                player: true
            }
        })

        res.status(200).send({score: score});

    } catch (error) {
        res.status(400).send({message: error.message });        
    }
}

export const roomScore = async (req, res) => {
    try {

        const {roomId} = req.body;

        let roomScore = await db.score.findMany({
            where: {
                roomId: roomId
            },
            include: {
                room: true,
                player: true
            }
        });

        res.status(200).send({score: roomScore});
    } catch (error) {
        res.status(400).send({message: error.message });
    }
}

export const roomInfo = async (req, res) => {
    try {

        let room = await db.room.findMany({  
            include: {
                roomInitialInformation: true,
                // scoreInformation: true
                // roomInitialInformation: {
                //     include: {
                //         player: true,
                //         job: true
                //     }
                // },
                // scoreInformation: {
                //     include: {
                //         player: true
                //     }
                // }
            },
        }) 

        res.status(200).send({room: room});

    } catch (error) {
        res.status(400).send({message: error.message });        
    }
}