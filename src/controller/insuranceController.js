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