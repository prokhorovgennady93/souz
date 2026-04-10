import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPhone = '79613002646'
  const passwordHash = await hash('3ghZ3Z32', 12)

  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {},
    create: {
      phone: adminPhone,
      password: passwordHash,
      fullName: 'Главный Администратор',
      role: 'ADMIN',
    },
  })

  console.log(`Создан базовый администратор: ${admin.phone}`)
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
