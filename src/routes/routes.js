import express from "express";
import * as playerController from '../controller/playerController.js'; 
import * as jobController from '../controller/jobController.js'; 

const route = express.Router();

route.get('/api', (req ,res) => {
    res.status(200).send("Hello, Welcome To Skills For Life Server.");
});

route.post('/api/player/create', playerController.create)
route.get('/api/player/fetchAll', playerController.fetchAll)
route.get('/api/player/fetchOne/:id', playerController.fetchOne)

route.get('/api/job/fetchAll', jobController.fetchAll)

export default route

