import { Router } from "express";
const router = Router()
import authMiddleware from "../middlewares/auth.middleware.js";
import { createFoodItem } from "../controllers/foodItem.controllers.js";

//Adding new food items in the restraurant menu 
router.post('/newFoodItem',authMiddleware , createFoodItem)

export default router