import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../prisma/prisma.ts";
import { catchAsync } from "../../utils/catchAsync.ts";
import { AppError } from "../../utils/AppError.ts";

export class userController{
    static getUser = catchAsync(async (req:Request, res:Response, next: NextFunction)=>{
        const {id} = req.params
        const targetId = Number(id)
        const currentUser = req.user

        if(!currentUser){
            return next(new AppError('Вы не авторизованы', 401))
        }

        if (currentUser.role !== 'ADMIN' && currentUser.id !== targetId) {
            return next(new AppError('У вас нет прав на просмотр данного профиля', 401))
        }

        const user = await prisma.user.findUnique({
            where:{id:targetId}
        })

        res.status(200).json({
            status:true,
            data: user
        })
    })
        static blockUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
        const targetId = Number(req.body.id)
         
        if (!targetId) {
            return next(new AppError('Не передан id', 400))
        }

        if (req.user!.role !== 'ADMIN' && req.user!.id !== targetId) {
            return next(new AppError('У вас нет прав для данного действия', 403))
        }

        await prisma.user.update({
            where:{id: req.body.id},
            data:{
                isBlocked: true
            }
        })

        res.status(200).json({
            status:true,
            message:'Пользователь заблокирован'
        })
    })
}