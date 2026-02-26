import { type Request, type Response, type NextFunction } from "express";
import bcrypt, { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { prisma } from "../../prisma/prisma.ts";
import { redis } from "../../configs/redis.ts";
import { catchAsync } from "../../utils/catchAsync.ts";
import { AppError } from "../../utils/AppError.ts";
import { comparePassword } from "../../utils/bcrypt.ts";

export class authorizationController{
    static authUser = catchAsync(async (req:Request,res:Response,next:NextFunction) => {
        const { email, password } = req.body
        if(!email || !password){
            return next(new AppError('Введите email и пароль', 400))
        }

        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user || !await comparePassword(password, user.password)){
            return next(new AppError('Неверный email или пароль', 403))
        }

        if(user.isBlocked){
            return next(new AppError('Вы заблокированы', 403))
        }

        const accessToken = jwt.sign(
            {
                id: user.id
            },
            process.env.ACCESS_SECRET as string,
            {expiresIn: process.env.ACCESS_EXPIRES} as jwt.SignOptions
        )

        const tokenId = randomUUID()

        const refreshToken = jwt.sign(
            {
                id: user.id,
                tokenId
            },
            process.env.REFRESH_SECRET as string,
            {expiresIn: process.env.REFRESH_EXPIRES} as jwt.SignOptions
        )

        await redis.set(
            `refresh:${user.id}`,
            tokenId,
            {EX: 30 * 24 * 60 * 60}
        )

        await prisma.user.update({
            where: {email},
            data: {online: true}
        })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            status:true,
            message:"Успешный вход"
        })
    })

    static logoutUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
        await prisma.user.update({
            where:{id: req.user!.id},
            data: {
                online: false
            }
        })
        await redis.del(`refresh:${req.user!.id}`)
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        res.status(200).json({
            status: true,
        })
    })
}