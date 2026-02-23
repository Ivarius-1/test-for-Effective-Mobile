import z from 'zod'

export const registrationSchema = z.object({
    fullName: z
        .string()
        .min(3, 'ФИО слишком короткое')
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, 'Только латиница или кириллица'),
    password: z
        .string()
        .min(4, "Пароль слишком короткий"),
    email: z
        .string()
        .email('Некорректный формат почты')
        .min(8, 'Почта слишком короткая')
        .max(40,'Почта слишком длинная')
})