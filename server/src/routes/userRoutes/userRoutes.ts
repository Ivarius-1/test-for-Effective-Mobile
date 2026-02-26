import { Router } from "express";
import { registrationController } from "../../controllers/userControllers/registrationController.ts";
import { authorizationController } from "../../controllers/userControllers/authorizationController.ts";
import { userController } from "../../controllers/userControllers/userController.ts";
import { adminController } from "../../controllers/userControllers/adminController.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { restrictTo } from "../../middlewares/restrictTo.ts";
import { rateLimit } from "../../middlewares/rateLimit.ts";

const userRouter = Router()

userRouter.post('/regUser', rateLimit({keyPrefix:'reg', limit:5, windowSec:60}), registrationController.regUser)

userRouter.post('/authUser', rateLimit({keyPrefix:'auth', limit:5, windowSec:60}), authorizationController.authUser)
userRouter.post('/logout', authMiddleware, authorizationController.logoutUser)

userRouter.get('/getUser/:id', authMiddleware, rateLimit({keyPrefix:'get.user', limit:5, windowSec:60}), userController.getUser)
userRouter.post('/blockUser', authMiddleware, userController.blockUser)

userRouter.get('/getAllUsers', authMiddleware, rateLimit({keyPrefix:'get.all.user', limit:10, windowSec:60}), restrictTo('ADMIN'), adminController.getAllUsers)

export default userRouter