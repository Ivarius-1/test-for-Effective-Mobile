import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync.ts'
import { AppError } from '../utils/AppError.ts'
import { prisma } from '../prisma/prisma.ts'

export const authMiddleware = catchAsync( async (
    req:Request, 
    res:Response, 
    next:NextFunction
)=>{
    const token = req.cookies.accessToken
    if(!token){
        return next(new AppError('Отсутствует токен', 401))
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string) as {id: number}
    
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true, isBlocked: true } // Берем только то, что нужно для проверки
    });

    if(!user){
        return next(new AppError('Пользователя больше не существует', 401))
    }

    if(user.isBlocked) {
        return next(new AppError('Ваш аккаунт был заблокирован', 403))
    }

    req.user = {
        id: user.id,
        role: user.role
    }
    next()
})