import { ca } from "zod/v4/locales";
import { redis } from "../configs/redis.ts";
import { AppError } from "../utils/AppError.ts";
import { catchAsync } from "../utils/catchAsync.ts";
import { type Request, type Response, type NextFunction } from "express";

interface limitOptions {
    keyPrefix: string
    limit: number
    windowSec: number
}

export const rateLimit = ({keyPrefix, limit, windowSec}: limitOptions) => {
    return catchAsync(async(req:Request, res:Response, next:NextFunction) => {
        const identifier = req.user?.id || req.ip
        const key = `${keyPrefix}:${identifier}`

        const current = await redis.incr(key)

        if(current === 1){
            await redis.expire(key, windowSec)
        }
        if(current > limit){
            return next(new AppError('Превышено количество запросов', 429))
        }
        
        next()
    })
}