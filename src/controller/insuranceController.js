import { generateRandomId, validateHash } from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const createInsurance = async (req, res) => {
    try {        
        const newInsurance = await db.insurance.create({
            data: {
                id: generateRandomId('ins_'),
                name: req.body.name,
                price: parseInt(req.body.price),
                img: req.file
            }
        })
        res.status(200).send({insurance: newInsurance})
    } catch (error) {
        
        res.status(400).send({message: error.message})
    }
}

export const fetchAll = async (req, res) => {
    try {
        let insurances = await db.insurance.findMany();
        res.status(200).send({insurances: insurances})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

export const buyInsurance = async (req, res) => {
    try {
        let player = await db.player.findUnique({
            where: {
                id: req.body.playerId
            },
            include: {
                roomInitialInfo: true,
                myScore: true
            }
        });
        // let newInsurance = await db.RoomInsuranceInformation.create({
        //     data: {
        //         id: generateRandomId('roomInsurInfo_'),
        //         roomId: req.body.roomId,
        //         playerId: req.body.playerId,
        //         insuranceId: req.body.insuranceId,
        //         moneyInTheBank: ``
        //     }
        // })

        res.status(200).send({data: player})
    } catch (error) {
        res.status(400).send({message: error.message})
        
    }
}
