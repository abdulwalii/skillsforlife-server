import { generateRandomId, updateRoomInitialInfoMoney } from "../genericFunctions.js";
import { PrismaClient } from "@prisma/client";
import e from "express";
import fs from 'node:fs'

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

        let {playerId, roomId} = req.params;
        let purchasedStations = [];
        let purchasedStationIds = [];
        let stations = [];


        stations = await db.station.findMany({
            include: {
                choices: {
                    include: {
                        internalChoices: true
                    }
                }
            },
        });

        if(playerId != null && roomId != null){

            purchasedStations = await db.roomStationInformation.findMany({
                where: {
                    playerId: playerId,
                    roomId: roomId,
                    refunded: false
                },
                select: {
                    stationId: true
                }
            });

            purchasedStations.forEach((station) => purchasedStationIds.push(station.stationId));

            stations.forEach((station) => {
                purchasedStationIds.includes(station.id) ? station['purchased'] = true : station['purchased'] = false
            })
        
        }

        res.status(200).send({stations: stations});
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

export const addChoiceToStation = async (req, res) => {
    try {
        let newChoice = await db.choices.create({
            data: {
                id: generateRandomId('choice_'),
                stationId: req.body.stationId,
                name: req.body.name,
                price: req.body.price,
                duration: req.body.duration,
                taxCredit: req.body.taxCredit,
                growthInPct: req.body.growthInPct,
                extraInfo: req.body.extraInfo
            }
        });
        res.status(200).send({ choice: newChoice, message: "Choice Added Successfully." });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const addInternalChoiceToStation = async (req, res) => {
    try {
        let newInternalChoice = await db.InternalChoices.create({
            data: {
                id: generateRandomId('intChoice_'),
                choiceId: req.body.choiceId,
                name: req.body.name,
                price: req.body.price,
                duration: req.body.duration,
            }
        });
        res.status(200).send({ internalChoice: newInternalChoice, message: "Internal Choice Added Successfully." });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const buyFromStation = async (req, res) => {
    try {

        const { playerId, roomId, stationId, choiceId, internalChoiceId } = req.body

        let internalChoice = {};
        let choice = {};
        let currentAmount = null;
        let purchaseAmount = null;
        let netAmount = null;
        let message = null;

        let refund = await refundPurchasesIfAny(req.body); // check if previous purchases exist, if exist it will be refunded.

        if ('successfull' in refund && refund.successfull) {

            return res.status(200).send({ message: refund.message });
        }

        let roomInitial = await db.roomInitialInformation.findFirst({
            where: {
                playerId: playerId,
                roomId: roomId
            },
        });

        currentAmount = roomInitial.moneyInTheBank;

        choice = await db.choices.findUnique({
            where: {
                id: choiceId
            }
        })

        if (internalChoiceId != null) {
            internalChoice = await db.internalChoices.findUnique({
                where: {
                    id: internalChoiceId
                }
            });

            purchaseAmount = internalChoice.price;
            message = `${internalChoice.name} purchased successfully.`

        } else {

            purchaseAmount = choice.price;
            message = `${choice.name} purchased successfully.`
        }

        // if (currentAmount < purchaseAmount) {
        //     let stationData = await db.roomStationInformation.findFirst({
        //         where: {
        //             playerId: playerId,
        //             roomId: roomId,
        //             bankType: 'saving',
        //         },
        //     });
        //     if(stationData?.deposit && roomInitial){
        //         await db.roomInitialInformation.update({
        //             where: {
        //                id : roomInitial
        //             },
        //             data: {
        //                 moneyInTheBank: roomInitial.moneyInTheBank + stationData?.deposit
        //             }
        //         });
        //         currentAmount += stationData?.deposit;
        //     }else{
        //         return res.status(406).send({ message: 'You have insufficient funds to purchase.' })
        //     }
        // }


        if (currentAmount < purchaseAmount) {
            let stationData = await db.roomStationInformation.findFirst({
                where: {
                    playerId: playerId,
                    roomId: roomId,
                    bankType: 'saving',
                    refunded: 0
                },
            });
        
            if (stationData && roomInitial) { // Check if stationData and roomInitial are not null
                const updatedMoneyInTheBank = roomInitial.moneyInTheBank + (stationData.deposit || 0); // Ensure deposit is not null
        
                await db.roomInitialInformation.update({
                    where: {
                       id: roomInitial.id // Assuming id is the primary key
                    },
                    data: {
                        moneyInTheBank: updatedMoneyInTheBank
                    }
                });
        
                currentAmount = updatedMoneyInTheBank; // Update currentAmount with the updated value
            } else {
                return res.status(406).send({ message: 'You have insufficient funds to purchase.' });
            }
        }
        

        choice.taxCredit == 0 ? netAmount = currentAmount - purchaseAmount : netAmount = (currentAmount - purchaseAmount) + choice.taxCredit;


        let newPurchaseData = {
            id: generateRandomId('roomStation_'),
            playerId: playerId,
            roomId: roomId,
            stationId: stationId,
            choiceId: choiceId,
            internalChoiceId: internalChoiceId,
            currentAmount: parseFloat(currentAmount.toFixed(2)),
            purchaseAmount: parseFloat(purchaseAmount.toFixed(2)),
            taxCredit: choice['taxCredit'],
            growth: choice['growthInPct'],
            netAmount: parseFloat(netAmount.toFixed(2))
        }

        if (choice.name === "Piggy Bank" || choice.name === "Saving Account" || choice.name === "Investment Account") {
        
            // Set the bankType based on the choice name
            switch (choice.name) {
                case "Piggy Bank":
                    newPurchaseData.deposit = 300;
                    newPurchaseData.bankType = "piggy";
                    break;
                case "Saving Account":
                    newPurchaseData.deposit = 100;
                    newPurchaseData.bankType = "saving";
                    break;
                case "Investment Account":
                    newPurchaseData.deposit = 200;
                    newPurchaseData.bankType = "investment";
                    break;
            }

            netAmount = newPurchaseData.netAmount - newPurchaseData.deposit;
        }


        let newPurchase = await db.roomStationInformation.create({
            data: newPurchaseData
        })

        let updatedRoomInfo = await updateRoomInitialInfoMoney(playerId, roomId, parseFloat(netAmount.toFixed(2)));

        res.status(200).send({ newPurchase: newPurchase, updatedRoomInfo: updatedRoomInfo, message: message });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}



export const refundPurchasesIfAny = async (body) => {

    try {
        const { playerId, roomId, stationId, choiceId, internalChoiceId } = body;

        let newNetAmount = null;
        let internalChoice = {};
        let choice = {};
        let message = null;

        let Obj = {
            playerId: playerId,
            roomId: roomId,
            stationId: stationId,
            choiceId: choiceId,
            refunded: false
        };

        internalChoiceId != null ? Obj['internalChoiceId'] = internalChoiceId : null;

        let roomStationInfoExist = await db.roomStationInformation.findFirst({
            where: Obj
        })

        if (roomStationInfoExist != null) {

            const { id, purchaseAmount, taxCredit } = roomStationInfoExist;

            let roomInitial = await db.roomInitialInformation.findFirst({
                where: {
                    playerId: playerId,
                    roomId: roomId
                },
            });

            newNetAmount = (roomInitial.moneyInTheBank + purchaseAmount) - taxCredit;

            if (internalChoiceId != null) {

                internalChoice = await db.internalChoices.findUnique({
                    where: {
                        id: internalChoiceId
                    }
                });

                message = `${internalChoice.name} refunded successfully.`;
            }
            else {

                choice = await db.choices.findUnique({
                    where: {
                        id: choiceId
                    }
                });

                message = `${choice.name} refunded successfully.`;
            }

            await db.roomStationInformation.update({
                where: {
                    id: id
                },
                data: {
                    refunded: true,
                    netAmountAfterRefunded: parseFloat(newNetAmount.toFixed(2))
                }
            });

            await updateRoomInitialInfoMoney(playerId, roomId, parseFloat(newNetAmount.toFixed(2)));

            return { successfull: true, message: message };
        }
        return { successfull: false };

    } catch (error) {
        return error.message
    }

}


// const getChoiceIds = async (names) => {
//     const choicesDataTransportation = await db.choices.findMany({
//         where: {
//             name: {
//               in: names
//             }
//           },
//           select: {
//             id: true
//           }
//     });
//     return choicesDataTransportation.map(choice => choice.id);
// }

// const getStationIdByName = async (name) => {
//     const stationData = await db.station.find({
//         where: {
//             name: name
//           },
//           select: {
//             id: true
//           }
//     });
//     return stationData;
// }

// const getUserStationChoice = async (station_id,choice_ids) => {
//      const data = await db.roomStationInformation.findMany({
//         where: {
//           playerId: req.params.playerId,
//           roomId: req.params.roomId,
//           stationId: station_id,
//           choiceId : {
//             in: choice_ids
//           },
//           refunded: false
//         },
//         select: {
//           stationId: true,
//           choiceId: true,
//           internalChoiceId: true
//         }
//       });
//       return data;
// }

// export const previousPurchasesForMaintenance = async (req, res) => {
//     try {
//         let purchases = [];
//         let stations = [];
//         let choices = [];
//         let internalChoices = []

//         // const station_names = ['Housing','Transportation','housing','transportation'];
//         const transportation_choice_names = ['Used Car','New Car','Dream Car','used car','new car','dream car'];
//         const housing_choice_names = ['House','house'];

//         const housing_station_id = this.getStationIdByName('Housing');
//         const transportation_station_id = this.getStationIdByName('Transportation');

//         const transportation_choice_ids = this.getChoiceIds(transportation_choice_names);
//         const housing_choice_ids = this.getChoiceIds(housing_choice_names);


//        this.getUserStationChoice(housing_station_id,housing_choice_ids);
//        this.getUserStationChoice(transportation_station_id,transportation_choice_ids);
        
       


//         // res.status(200).send({stations: stations, choices: choices, internalChoices: internalChoices})
//     } catch (error) {
//         res.status(400).send({ message: error.message });        
//     }
// }






const getChoiceIds = async (names) => {
    const choicesData = await db.choices.findMany({
        where: {
            name: {
                in: names
            }
        },
        select: {
            id: true
        }
    });
    return choicesData.map(choice => choice.id);
}

const getStationIdByName = async (name) => {
    const stationData = await db.station.findFirst({
        where: {
            name: name
        },
        select: {
            id: true
        }
    });
    return stationData ? stationData.id : null;
}

const getUserStationChoice = async (playerId, roomId, stationId, choiceIds) => {
    const data = await db.roomStationInformation.findMany({
        where: {
            playerId: playerId,
            roomId: roomId,
            stationId: stationId,
            choiceId: {
                in: choiceIds
            },
            refunded: false
        },
        select: {
            stationId: true,
            choiceId: true,
            internalChoiceId: true
        }
    });
    return data;
}

export const previousPurchasesForMaintenance = async (req, res) => {
    try {
        const playerId = req.params.playerId;
        const roomId = req.params.roomId;

        const housingStationId = await getStationIdByName('Housing');
        const transportationStationId = await getStationIdByName('Transportation');

        const housingChoiceIds = await getChoiceIds(['House']);
        const transportationChoiceIds = await getChoiceIds(['Used Car', 'New Car', 'Dream Car']);

        const housingData = await getUserStationChoice(playerId, roomId, housingStationId, housingChoiceIds);
        const transportationData = await getUserStationChoice(playerId, roomId, transportationStationId, transportationChoiceIds);


        const obj = {'Lawn Care':false,'Car Fuel':false};

        if (housingData && housingData.length > 0) {
            obj['Lawn Care'] = true;
        }

        if (transportationData && transportationData.length > 0) {
            obj['Car Fuel'] = true;
            obj['Car Wash'] = true;
            obj['Car Detailing'] = true;
        }

        res.status(200).send(obj);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}




export const previousPurchases = async (req, res) => {
    try {
        let purchases = [];
        let stations = [];
        let choices = [];
        let internalChoices = []
        
        purchases = await db.roomStationInformation.findMany({
            where: {
                playerId: req.params.playerId,
                roomId: req.params.roomId,
                stationId: req.params.stationId,
                refunded: false
            },
            select: {
                stationId: true,
                choiceId: true,
                internalChoiceId: true
            }
        });

        purchases.forEach((purchase) => {
            stations.push(purchase.stationId);
            choices.push(purchase.choiceId);
            internalChoices.push(purchase.internalChoiceId);
        })

        stations = [...new Set(stations)]
        choices = [...new Set(choices)]
        internalChoices = [...new Set(internalChoices)]

        res.status(200).send({stations: stations, choices: choices, internalChoices: internalChoices})
    } catch (error) {
        res.status(400).send({ message: error.message });        
    }
}

export const updateChoice = async (req, res) => {
    try {

        let choice = await db.choices.findUnique({
            where: {
                id: req.body.id
            }
        })

        let unlinkMessage = null;
        
        if(req.file != undefined){

            if(choice.image != null){

                fs.unlink(req.body.user.profileImage.path, (err) => {
                    if(err){
                        unlinkMessage = err;
                    }
                });

            }
        }

        let choiceUpdate = await db.choices.update({
            where: {
                id: req.body.id
            },
            data: {
                image: req.file
            }
        })
        res.status(200).send({data: choiceUpdate})
    } catch (error) {
        res.status(400).send({ message: error.message });        
    }
}