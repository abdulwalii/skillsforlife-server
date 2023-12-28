import  {generateRandomId}  from "../genericFunctions.js";
import { getAllJobs } from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const fetchAll = async(req ,res) => {

    try {
        let allJobs = await getAllJobs();
        res.status(200).send({jobs: allJobs})
    } catch (error) {
        res.status(400).send({message: error.message})
    }

}

