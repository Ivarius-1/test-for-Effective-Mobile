import { prisma } from "./prisma.ts";
import bcrypt from 'bcrypt'

async function main() {
    const adminPassword = await bcrypt.hash('Admin-password', 10)

    await prisma.user.upsert({
        where: {email: 'admin@admin.com'},
        update:{},
        create: {
            fullName: 'admin',
            email: 'admin@admin.com',
            password: adminPassword,
            role: 'ADMIN',
        }
    })
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })