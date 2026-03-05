import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { config } from 'dotenv';
config({ path: ".env.development" });

const prisma = new PrismaClient();

export async function seedUsers() {
    const passwordAdmin = await bcrypt.hash('admin123', 10)
    const passwordUser = await bcrypt.hash('user123', 10)

    await prisma.user.createMany({
        data: [
            {
                email: 'admin@example.com',
                password: passwordAdmin
            },
            {
                email: 'user@example.com',
                password: passwordUser
            }
        ],
        skipDuplicates: true
    })

    console.log('✅ User seed with hashed password completed')
}