import { generateRandomId, validateHash, updateRoomInitialInfoMoney, findNullKeys } from "../genericFunctions.js";
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

        let nullKeys = await findNullKeys(req.body);

        if(nullKeys.length > 0) {
            return res.status(400).send({message: 'Incomplete Information', nullKeys: nullKeys})
        }        

        // get player's roominitialinformation.
        let roomInitialInfo = await db.roomInitialInformation.findFirst({
            where: {
                playerId: req.body.playerId,
                roomId: req.body.roomId
            }
        })

        // get insurance information that player wants to buy.        
        let insurance = await db.Insurance.findUnique({
            where: {
                id: req.body.insuranceId
            }
        })
        
        // new money in the bank after purchase
        const newMoney = roomInitialInfo.moneyInTheBank - insurance.price;

        // create insurance information that player purchased
        let newInsuranceInformation = await db.RoomInsuranceInformation.create({
            data: {
                id: generateRandomId('roomInsurInfo_'),
                roomId: req.body.roomId,
                playerId: req.body.playerId,
                insuranceId: req.body.insuranceId,                
            }
        });
        
        // update the money in the banck in roomInitialInformation
        const updatedRoomInfo = await updateRoomInitialInfoMoney(req.body.playerId, req.body.roomId, newMoney)

        res.status(200).send({updatedRoomInitialInfo: updatedRoomInfo, newInsuranceInformation: newInsuranceInformation})
    } catch (error) {
        res.status(400).send({message: error.message})
        
    }
}


