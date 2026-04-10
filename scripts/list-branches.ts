import { db } from "../src/lib/db";

async function listBranches() {
  const branches = await db.branch.findMany({
    orderBy: { name: 'asc' }
  });

  console.log("--- СПИСОК ФИЛИАЛОВ ДЛЯ СИСАДМИНА ---");
  console.log("ID | Название | Текущий RTSP | Текущий IP");
  console.log("------------------------------------------");
  
  branches.forEach(b => {
    console.log(`${b.id} | ${b.name} | ${b.rtspUrl || 'НЕ ЗАДАНО'} | ${b.expectedIp || 'НЕ ЗАДАНО'}`);
  });
  
  console.log("------------------------------------------");
}

listBranches()
  .catch(console.error)
  .finally(() => db.$disconnect());
