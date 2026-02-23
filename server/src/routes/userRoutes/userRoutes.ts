import { Router } from "express";
import { registrationController } from "../../controllers/userControllers/registrationController.ts";
import { authorizationController } from "../../controllers/userControllers/authorizationController.ts";
import { userController } from "../../controllers/userControllers/userController.ts";
import { adminController } from "../../controllers/userControllers/adminController.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { restrictTo } from "../../middlewares/restrictTo.ts";

const userRouter = Router()

userRouter.post('/regUser', registrationController.regUser)

userRouter.post('/authUser', authorizationController.authUser)
userRouter.post('/logout', authMiddleware, authorizationController.logoutUser)

userRouter.get('/getUser/:id',  authMiddleware, userController.getUser)
userRouter.post('/blockUser', authMiddleware, userController.blockUser)

userRouter.get('/getAllUser1s', authMiddleware, restrictTo('ADMIN'), adminController.getAllUsers)

export default userRouter