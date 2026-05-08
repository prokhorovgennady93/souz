
import { PrismaClient } from '../src/generated/client'

process.env.DATABASE_URL = 'file:../prisma/dev.db'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { fullName: true, phone: true }
  })
  console.log(JSON.stringify(users, null, 2))
  await prisma.$disconnect()
}

main()
