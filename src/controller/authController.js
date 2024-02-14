import { generateRandomId, validateHash, generateHash } from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";
import fs from 'node:fs';

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

export const getUser = async (id) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        })
        return user
    } catch (error) {
        return error.message
    }
}

export const updateProfile = async (req, res) => {
    try {
        
        let unlinkMessage = null;
        let obj = {userName: req.body.name};
        
        if(req.file != undefined){

            obj['profileImage'] = req.file;

            if(req.body.user.profileImage != null){

                fs.unlink(req.body.user.profileImage.path, (err) => {
                    if(err){
                        unlinkMessage = err;
                    }
                });

            }

        }
                
        let updatedUser = await db.user.update({
            where: {
                id: req.body.user.id
            },
            data: obj
        });
        
        res.status(200).send({user: updatedUser, unlinkMessage: unlinkMessage })

    } catch (error) {
        res.status(400).send({message: error.message});        
    }
}


export const changePassword = async (req, res) => {
    try {
        let {currentPassword, newPassword} = req.body;

        let check = await validateHash(currentPassword, req.body.user.password);

        if(!check){
            return res.status(400).send({message: `Incorrect Password.`})
        }

        await db.user.update({
            where:{
                id: req.body.user.id
            },
            data: {
                password: await generateHash(newPassword)
            }
        })

        res.status(200).send({message: `Password Updated Successfully.`});

    } catch (error) {
        res.status(400).send({message: error.message});        
    }
}