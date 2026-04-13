import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function check() {
  const branches = await db.branch.findMany({
    select: {
      id: true,
      name: true,
      expectedIp: true,
      rtspUrl: true
    },
    take: 5
  });
  console.log(JSON.stringify(branches, null, 2));
}

check().catch(console.error).finally(() => db.$disconnect());
