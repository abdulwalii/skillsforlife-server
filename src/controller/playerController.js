import  {generateRandomId, findNullKeys}  from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const createOne = async (req, res) => {
    try {

        let copyBody = req.body;
        delete copyBody.classCode;

        let nullKeys = await findNullKeys(copyBody);

        if(nullKeys.length > 0) {
            return res.status(400).send({message: 'Incomplete Information', nullKeys: nullKeys})
        }     

        const newPlayer = await db.player.create({
            data: {
                id: generateRandomId("player_"),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                grade: req.body.grade,
                phoneNumber: req.body.phoneNumber,
                city: req.body.city,
                state: req.body.state,
                parentFullName: req.body.parentFullName,
                parentEmail: req.body.parentEmail,
                parentPhoneNumber: req.body.parentPhoneNumber,
                school: req.body.school,
                classCode: req.body.classCode ? req.body.classCode : null
            },
            include: {
                roomInitialInfo: true,
                roomInsuranceInfo: true
            }
        });

        res.status(200).send({player: newPlayer, message: 'Successfull.'});
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const fetchAll = async (req, res) => {
    try {
        const players = await db.player.findMany();
        res.status(200).send({players: players}); 
    } catch (error) {
        res.status(400).send({ message: error.message });    
    }
}
export const fetchOne = async (req, res) => {
    try {
        const user = await db.player.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                myScore: true,
                roomInitialInfo: true
            }
        });
        res.status(200).send({user: user}); 
    } catch (error) {
        res.status(400).send({ message: error.message });    
    }
}

export const playerInformation = async (req, res) => {
    try {
        let playerInformation = await db.Player.findUnique({
            where: {
                id: req.params.playerId
            },
            include: {
                roomInitialInfo: {
                    where: {
                        playerId: req.params.playerId,
                        roomId: req.params.roomId
                    },
                    include: {
                        job: true
                    }
                },
                myScore: true,
                roomInsuranceInfo: {
                    where: {
                        playerId: req.params.playerId,
                        roomId: req.params.roomId
                    }
                }
            }
        });


        res.status(200).send({player: playerInformation}); 

    } catch (error) {
        res.status(400).send({ message: error.message });        
    }
}