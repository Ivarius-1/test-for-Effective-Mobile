import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../prisma/prisma.ts";
import { catchAsync } from "../../utils/catchAsync.ts";
import { AppError } from "../../utils/AppError.ts";

export class adminController{
    static getAllUsers = catchAsync( async (req:Request, res:Response, next:NextFunction)=>{
        const users = await prisma.user.findMany()

        res.status(200).json({
            status:true,
            data: users
        })
    })
}