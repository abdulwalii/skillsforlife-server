import  {generateRandomId}  from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const create = async (req, res) => {
    try {
        const newUser = await db.player.create({
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
                classCode: req.body.classCode ? req.body.classCode : null
            }
        });

        res.status(200).send({player: newUser, message: 'Successfull.'});
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const fetchAll = async (req, res) => {
    try {
        const users = await db.player.findMany();
        res.status(200).send({users: users}); 
    } catch (error) {
        res.status(400).send({ message: error.message });    
    }
}
export const fetchOne = async (req, res) => {
    try {
        const user = await db.player.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send({user: user}); 
    } catch (error) {
        res.status(400).send({ message: error.message });    
    }
}