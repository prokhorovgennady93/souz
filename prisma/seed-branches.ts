import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const branches = [
    // ЦЕНТР
    { name: "Ворошиловский, 91", openTime: "08:00", closeTime: "20:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Ленина, 83", openTime: "09:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Буденновский, 96", openTime: "09:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "М. Горького, 11/43", openTime: "09:00", closeTime: "17:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Красноармейская, 133", openTime: "09:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    // НАХИЧЕВАНЬ
    { name: "Сельмаш, 98", openTime: "09:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "40-Летия Победы, 292", openTime: "09:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    // СЕВЕРНЫЙ
    { name: "Комарова, 26", openTime: "09:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    // ЗАПАДНЫЙ
    { name: "Коммунистический, 29", openTime: "08:00", closeTime: "20:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Жукова, 34", openTime: "09:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    // СУВОРОВСКИЙ
    { name: "Петренко, 8", openTime: "09:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    // ОБЛАСТЬ
    { name: "Азов, Петровский бульвар, 5А", openTime: "08:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Аксай, Ленина, 30", openTime: "09:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Батайск, Энгельса, 174", openTime: "08:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Волгодонск 1, ул. Ленина, 93", openTime: "08:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Волгодонск 2, пр. Строителей 12/15", openTime: "08:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Каменск-Шахтинский, ул. Ворошилова, 15", openTime: "08:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Новочеркасск, пр. Баклановский, 68", openTime: "08:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Новошахтинск, ул. Базарная, 26э", openTime: "08:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Таганрог 1, пер. Спартаковский, 3", openTime: "08:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Таганрог 2, ул. Чехова, 340А", openTime: "09:00", closeTime: "18:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Шахты 1, пр. Победа Революции, 85", openTime: "08:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Шахты 2, пр. Ленинского Комсомола, 36", openTime: "09:00", closeTime: "19:00", breakStartTime: "12:00", breakEndTime: "13:00" },
    { name: "Шахты 3, ул. Текстильная, 29Б", openTime: "08:00", closeTime: "19:00", breakStartTime: "13:00", breakEndTime: "14:00" },
    { name: "Беляева, 24", openTime: "09:00", closeTime: "18:00", breakStartTime: "13:00", breakEndTime: "14:00" }
  ];

  console.log("Очистка текущих филиалов (сброс)...");
  await prisma.branch.deleteMany();

  console.log("Добавление филиалов...");
  for (const branch of branches) {
    await prisma.branch.create({
      data: {
        name: branch.name,
        address: branch.name,
        openTime: branch.openTime,
        closeTime: branch.closeTime,
        breakStartTime: branch.breakStartTime,
        breakEndTime: branch.breakEndTime,
        scheduleType: "5/2" // Временный дефолт, админ может менять
      }
    });
    console.log(`+ Добавлен: ${branch.name}`);
  }

  console.log("Готово! Создано 25 филиалов.");
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
