import { type Request, type Response, type NextFunction } from "express";
import bcrypt from 'bcrypt'
import { prisma } from "../../prisma/prisma.ts";
import { catchAsync } from "../../utils/catchAsync.ts";
import { registrationSchema } from "../../validators/req.schema.ts";

export class registrationController{
    static regUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const validators = registrationSchema.parse(req.body)
        const {fullName, password, email } = validators

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                fullName,
                password: hashedPassword,
                email,
                role: 'USER'
            }
        })

        res.status(201).json({
            status:true,
            message:'Пользователь создан'
        })
    })
}