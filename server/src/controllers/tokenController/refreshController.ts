import { type Request, type Response, type NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { redis } from "../../configs/redis.ts";
import { catchAsync } from "../../utils/catchAsync.ts";
import { AppError } from "../../utils/AppError.ts";

export class refreshController{
    static refresh = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return next(new AppError('Токен не найден', 404))
        }

        const payload = jwt.verify(refreshToken,  process.env.REFRESH_SECRET as string) as {
            id: number
            tokenId: string
        }

        const {id, tokenId} = payload

        const storedTokenId = await redis.get(`refresh:${id}`)

        if(!storedTokenId || storedTokenId !== tokenId) {
            return next(new AppError('Неверный токен', 401))
        }

        const accessToken = jwt.sign(
            {
                id
            },
            process.env.ACCESS_SECRET as string,
            {expiresIn: process.env.ACCESS_EXPIRES} as jwt.SignOptions
        )

        res.cookie('accessToken', accessToken,{
            httpOnly: true,
            secure:false,
            sameSite:'strict',
            maxAge: 15 * 60 * 1000
        })

        res.status(200).json({
            status:true,
            message:'Токен обновлён'
        })
    })
}