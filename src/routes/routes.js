import express from "express";
import * as userController from '../controller/userController.js'; 

const route = express.Router();

route.post('/api/user/signup', userController.createUser)
route.get('/api/user/fetchAll', userController.fetchAll)
route.get('/api/user/fetchOne/:id', userController.fetchOne)

export default route

