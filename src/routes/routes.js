import express from "express";
import * as userController from '../controller/userController.js'; 
import * as roomController from '../controller/roomController.js'; 

const route = express.Router();

route.get('/api', (req ,res) => {
    res.status(200).send("Hello, Welcome To Skills For Life Server.");
});

route.post('/api/user/create', userController.create)
route.get('/api/user/fetchAll', userController.fetchAll)
route.get('/api/user/fetchOne/:id', userController.fetchOne)

route.post('/api/room/create', roomController.create)


export default route

