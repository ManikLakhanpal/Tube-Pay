import { PrismaClient } from "../prisma/generated/prisma";

const prisma = new PrismaClient({
    log: ["query"]
})

export default prisma;