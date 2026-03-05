import { PrismaClient } from '@prisma/client'
import { seedUsers } from "./seeds/user.seed"

import { config } from "dotenv";

config({ path: ".env.development" });

const prisma = new PrismaClient()

async function main() {
    await seedUsers()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })