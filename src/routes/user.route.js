import { Router } from 'express';
const route = Router();

import userController from '../controllers/user.controller.js'
import middlewares from "../middlewares/global.middleware.js"

route.post("/", userController.create);
route.get("/", userController.findAll)
route.get("/:id", middlewares.validId, middlewares.validUser, userController.findById)
route.patch("/:id", middlewares.validId, middlewares.validUser, userController.updateById)

export default route; 