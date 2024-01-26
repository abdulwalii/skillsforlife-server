import { generateRandomId } from "../genericFunctions.js";
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
        res.status(200).send({ station: newStation })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

export const updateOne = async (req, res) => {
    try {
        let isCodeUsed = await db.station.findFirst({
            where: {
                code: req.body.code
            }
        });
        if (isCodeUsed != null) {
            return res.status(400).send({ message: `Code Already Assigned To ${isCodeUsed.name}` })
        }        
        let station = await db.station.update({
            where: {
                id: req.body.id
            },
            data: {
                code: req.body.code
            }
        });
        res.status(200).send({ station: station, message: 'Station Updated Successfully.' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

export const fetchAll = async (req, res) => {
    try {
        let stations = await db.station.findMany({
            include: {
                choices: true
            }
        });
        res.status(200).send({ stations: stations })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

