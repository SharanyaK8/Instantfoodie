import { Router } from "express"; 
import {
PlaceOrder,
getRestaurantOrders,
updateOrderStatus,
getMyOrders
} from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router()

router.post('/placeOrder', authMiddleware ,PlaceOrder)

router.get("/myOrders", authMiddleware, getMyOrders);

router.get('/restaurants',authMiddleware , getRestaurantOrders)

router.patch('/:orderId' , authMiddleware , updateOrderStatus)

export default router;