import { Router } from "express"
import { userLogin, userLogout, userRegister ,restaurantLogin} from "../controllers/auth.controllers.js"


const router = Router()

// Register a new user or restaurant owner
router.post("/register", userRegister)

// Login existing user
router.post("/login", userLogin)

// Logout user
router.post("/logout",userLogout)

// Restaurant Login
router.post("/restaurant/login", restaurantLogin)

//different route for logout . function for logout of restaurant and owner are same as it clears the cookie and does not depend on the role.
router.post("/restaurant/logout", userLogout)

export default router