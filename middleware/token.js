import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const verifyToken = async (req, res, next) => {
    const fullToken = req.header("Authorization");
    if(!fullToken) {
        return res.status(401).send("Access Denied.");
    }
    const Token = fullToken.split(" ")[1];
    try {        
        let user = await db.user.findUnique({
            where: {
                apiToken: Token
            }
        });
        if(user){
            req.body.user = user;
            next();
        }
        else{
            res.status(401).send({message: "Unauthorized"});
        }        
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}