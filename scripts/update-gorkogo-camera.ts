import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const branchName = "Горького";
  const rtspUrl = "rtsp://185.154.72.229:554/user=www&password=654123&channel=1&stream=0?";

  console.log(`Обновление филиала: ${branchName}...`);

  const branch = await prisma.branch.findFirst({
    where: { name: { contains: branchName } }
  });

  if (branch) {
    await prisma.branch.update({
      where: { id: branch.id },
      data: { rtspUrl }
    });
    console.log(`✅ Филиал "${branch.name}" успешно обновлен.`);
    console.log(`Новый RTSP: ${rtspUrl}`);
  } else {
    console.log(`❌ Ошибка: Филиал с названием "${branchName}" не найден в базе.`);
    
    // Выведем список всех филиалов для отладки
    const all = await prisma.branch.findMany({ select: { name: true } });
    console.log("Доступные филиалы:", all.map(a => a.name).join(", "));
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
