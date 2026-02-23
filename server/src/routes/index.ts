import { Router } from "express";
import { refreshController } from "../controllers/tokenController/refreshController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import userRouter from "./userRoutes/userRoutes.ts";

export const route = Router()

route.use('/', userRouter)
route.post('/refresh', authMiddleware, refreshController.refresh)
