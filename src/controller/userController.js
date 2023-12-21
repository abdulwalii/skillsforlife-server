import  {generateRandomId}  from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const create = async (req, res) => {
    try {
        const newUser = await db.user.create({
            data: {
                id: generateRandomId("user_"),
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

        res.status(200).send({message: newUser});
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const fetchAll = async (req, res) => {
    try {
        const users = await db.user.findMany();
        res.status(200).send({users: users}); 
    } catch (error) {
        res.status(400).send({ message: error.message });    
    }
}
export const fetchOne = async (req, res) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send({user: user}); 
    } catch (error) {
        res.status(400).send({ message: error.message });    
    }
}