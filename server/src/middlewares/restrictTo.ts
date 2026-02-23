import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/AppError.ts";

export const restrictTo = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
    if(!roles.includes(req.user.role)){
        return next(new AppError('У вас нет прав для данного действия', 403))
    }

    next()
}
}