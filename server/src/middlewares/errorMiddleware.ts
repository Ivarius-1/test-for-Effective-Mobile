import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/AppError.ts";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Ошибка сервера'
    let status = err.status || 'error'

    if(err.code === 'P2025'){
        statusCode = 404
        message = 'Запись не найдена'
    }

    if(err.code === 'P2002'){
        statusCode = 400
        message = 'Значение занято'
    }

    if(statusCode === 403){
        message = 'У вас нет прав для этого действия'
    }

    if(err.name === 'JsonWebTokenError'){
        statusCode = 401
        message = 'Токен истёк'
    }

    if(err.name === 'TokenExpiredError'){
        statusCode = 401
        message = 'Срок действия токена истёк'
    }

    if(statusCode === 500) {
        console.error(`Error: ${err}`)
    }

    res.status(statusCode).json({
        status: status,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
}