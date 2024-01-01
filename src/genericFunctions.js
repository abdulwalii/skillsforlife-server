import { PrismaClient } from "@prisma/client";
import {v4 as uuidv4} from 'uuid';

const db = new PrismaClient();

export const generateRandomId = (name) => {
    return name.concat(uuidv4());
}


export const generateString = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
export const getAllJobs = async () => {
    try {
        let allJobs = await db.job.findMany();
        return allJobs
    } catch (error) {
        return error.message
    }
}