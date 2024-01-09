import { PrismaClient } from "@prisma/client";
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt'

const db = new PrismaClient();

export const generateRandomId = (name) => {
    return name.concat(uuidv4());
}


export const generateString = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
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

export const generateHash = async (password) => {
    const saltRounds = 10;
    return new Promise ((resolve ,reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err)
            } else{
                resolve(hash)
            }
        })
    })
} 

export const validateHash = async (password, hash) => {
    return new Promise ((resolve ,reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                reject(err)
            } else{
                resolve(result)
            }
        })
    })
} 

export const updateRoomInitialInfoMoney = async (playerId, roomId, money) => {
    try {
        const updatedRoomInfo = await db.roomInitialInformation.updateMany({
            where: {
                playerId: playerId,
                roomId: roomId
            },
            data: {
                moneyInTheBank: money
            }
        });
        return updatedRoomInfo
    } catch (error) {
        return error.message
    }
}

export const findNullKeys = async (obj) => {
    const nullKeys = [];
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === '' )) {
        nullKeys.push(key);
      }
    }
  
    return nullKeys;
  }