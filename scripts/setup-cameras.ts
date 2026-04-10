import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- НАСТРОЙКИ ФИЛИАЛОВ ---
  // Добавьте сюда данные ваших филиалов
  const configs = [
    {
      name: "Центральный офис", // Название для поиска в базе
      rtspUrl: "rtsp://admin:password@1.2.3.4:554/stream1", 
      expectedIp: "1.2.3.4"
    },
    {
      name: "Филиал Север",
      rtspUrl: "rtsp://admin:password@5.6.7.8:554/live",
      expectedIp: "5.6.7.8"
    }
  ];

  console.log("--- Настройка оборудования филиалов ---");

  for (const conf of configs) {
    const branch = await prisma.branch.findFirst({
      where: { name: { contains: conf.name } }
    });

    if (branch) {
      await prisma.branch.update({
        where: { id: branch.id },
        data: {
          rtspUrl: conf.rtspUrl,
          expectedIp: conf.expectedIp
        }
      });
      console.log(`✅ OK: ${branch.name} обновлен.`);
    } else {
      console.log(`❌ Ошибка: Филиал "${conf.name}" не найден.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
