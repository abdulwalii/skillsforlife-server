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

export const fetchRandomJob = async () => {
    try {
        let jobs = await db.job.findMany({
            select: {
                id: true,
            },
        });

        let jobIds = jobs.map((job) => job.id);
        let randomJobId = Math.floor(Math.random() * jobIds.length);

        let randomJob = await db.job.findUnique({
            where: {
                id: jobIds[randomJobId]
            }
        })

        return randomJob
    } catch (error) {
        return error.message
    }
} 

