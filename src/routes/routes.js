import express from "express";
import * as file from '../uploadeFiles.js'
import * as playerController from '../controller/playerController.js'; 
import * as jobController from '../controller/jobController.js'; 
import * as stationController from '../controller/stationController.js'; 
import * as roomController from '../controller/roomController.js'; 
import * as authController from '../controller/authController.js'; 
import * as insuranceController from '../controller/insuranceController.js'; 
import * as mdv from '../../middleware/token.js'

const route = express.Router();

route.get('/api', (req ,res) => {
    res.status(200).send("Hello, Welcome To Skills For Life Server.");
});

route.post('/api/admin/login', authController.login)
route.get('/api/admin/verify', mdv.verifyToken, authController.verify)

route.post('/api/admin/update',file.uploadProfileImage.single('image'), mdv.verifyToken, authController.updateProfile)
route.post('/api/admin/change-password', mdv.verifyToken, authController.changePassword)

route.post('/api/player/create', playerController.createOne)
route.get('/api/player/fetchAll', playerController.fetchAll)
route.get('/api/player/fetchOne/:id', playerController.fetchOne)
route.get('/api/player/room-information/:playerId/:roomId', playerController.playerInformation)

route.get('/api/job/fetchAll', jobController.fetchAll)

route.get('/api/station/fetchAll/:playerId?/:roomId?', stationController.fetchAll)
route.post('/api/station/update', stationController.updateOne)
route.post('/api/station/add-choice', stationController.addChoiceToStation)
route.post('/api/station/add-internal-choice', stationController.addInternalChoiceToStation)

route.post('/api/room/create', roomController.createRoom)
route.get('/api/room/find/:id?', roomController.fetchRoom)

route.get('/api/room-information/:roomId?', roomController.fetchRoomInformation)

route.get('/api/insurance/fetchAll', insuranceController.fetchAll)
route.post('/api/insurance/buyInsurance', insuranceController.buyInsurance)

route.post('/api/station/buy', stationController.buyFromStation)
route.get('/api/station/previous-purchases/:playerId/:roomId/:stationId', stationController.previousPurchases)

// route.post('/api/insurance/create', file.uploadInsuranceImage.single('image'),insuranceController.createInsurance)


export default route
