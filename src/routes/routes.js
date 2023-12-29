import express from "express";
import * as file from '../uploadeFiles.js'
import * as playerController from '../controller/playerController.js'; 
import * as jobController from '../controller/jobController.js'; 
import * as stationController from '../controller/stationController.js'; 

const route = express.Router();

route.get('/api', (req ,res) => {
    res.status(200).send("Hello, Welcome To Skills For Life Server.");
});

route.post('/api/player/create', playerController.createOne)
route.get('/api/player/fetchAll', playerController.fetchAll)
route.get('/api/player/fetchOne/:id', playerController.fetchOne)

route.get('/api/job/fetchAll', jobController.fetchAll)

route.get('/api/station/fetchAll', stationController.fetchAll)

// route.post('/api/station/adbg/:id', file.uploadStationImage.single('image'), stationController.addBgImage)
// route.post('/api/station/adth/:id', file.uploadStationImage.single('image'), stationController.addThumbImage)


export default route
