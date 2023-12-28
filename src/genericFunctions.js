import { PrismaClient } from "@prisma/client";
import {v4 as uuidv4} from 'uuid';

const db = new PrismaClient();

export const generateRandomId = (name) => {
    return name.concat(uuidv4());
}

export const getAllJobs = async () => {
    try {
        let allJobs = await db.job.findMany();
        return allJobs
    } catch (error) {
        return error.message
    }
}