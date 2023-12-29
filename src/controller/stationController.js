import  {generateRandomId}  from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const createOne = async (req, res) => {
    try {
        const newStation = await db.station.create({
            data: {
                id: generateRandomId('station_'),
                name: req.body.name,
            }
        })
        res.status(200).send({station: newStation})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

export const fetchAll = async (req, res) => {
    try {
        let stations = await db.station.findMany({
            include: {
                choices: true
            }
        });
        res.status(200).send({stations: stations})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

