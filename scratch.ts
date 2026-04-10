import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

const db = new PrismaClient();

async function test() {
  const startDate = startOfDay(new Date());
  const endDate = endOfDay(new Date());

  const shifts = await db.shift.findMany({
    where: {
      openedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: { select: { id: true, fullName: true } },
      branch: true
    }
  });

  console.log(`Shifts for today: ${shifts.length}`);
  for (const s of shifts) {
    console.log(`${s.user.fullName}: openedAt ${s.openedAt}`);
  }
}

test().catch(console.error).finally(() => db.$disconnect());
