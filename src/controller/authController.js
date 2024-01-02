import { generateRandomId, validateHash } from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const login = async (req, res) => {
    try {

        if(Object.keys(req.body).length == 0){
            return res.status(400).send({message: 'Email & Password is required.'})
        }
        let user = await db.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if(user){
            if(await validateHash(req.body.password, user.password)){

                const updatedUser = await db.user.update({
                    where: {
                        email: req.body.email
                    },
                    data: {
                        apiToken: generateRandomId("api_")
                    }
                });
                res.status(200).send({user: updatedUser})

            }else{

                res.status(400).send({message: 'Invalid Password'});
            }
        }else{
            
            res.status(400).send({message: 'user not found'});
        }

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

export const verify = async (req, res) => {
    try {
        res.status(200).send({user: req.body.user})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}