import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const usersData = [
    { branchName: "Ворошиловский, 91", fullName: "Лазуренко Наталья Владимировна" },
    { branchName: "Ленина, 83", fullName: "Овчарова Ольга Павловна" },
    { branchName: "Буденновский, 96", fullName: "Вишнякова Анастасия Алексеевна" },
    { branchName: "Красноармейская, 133", fullName: "Рокачева Юлия Андреевна" },
    { branchName: "Сельмаш, 98", fullName: "Аветян Асмик Арменовна" },
    { branchName: "40-Летия Победы, 292", fullName: "Лахина Дарья Алексеевна" },
    { branchName: "Комарова, 26", fullName: "Недопекина Алия Алексеевна" },
    { branchName: "Коммунистический, 29", fullName: "Кузьменко Анна Дмитриевна" },
    { branchName: "Жукова, 34", fullName: "Пичкалева Элина Олеговна" },
    { branchName: "Петренко, 8", fullName: "Тевосян Светлана Михайловна" },
    { branchName: "Азов, Петровский бульвар, 5А", fullName: "Николаева Виолетта Витальевна" },
    { branchName: "Аксай, Ленина, 30", fullName: "Хасанова Луиза Руслановна" },
    { branchName: "Батайск, Энгельса, 174", fullName: "Гуцул Андрей Павлович" },
    { branchName: "Волгодонск 1, ул. Ленина, 93", fullName: "Гребенникова Арина Андреевна" },
    { branchName: "Волгодонск 2, пр. Строителей 12/15", fullName: "Казанкова Ксения Александровна" },
    { branchName: "Волгодонск 2, пр. Строителей 12/15", fullName: "Медведева Ксения Сергеевна" },
    { branchName: "Каменск-Шахтинский, ул. Ворошилова, 15", fullName: "Сижажева Ангелина Назимовна" },
    { branchName: "Новочеркасск, пр. Баклановский, 68", fullName: "Гусева Дарья Федоровна" },
    { branchName: "Новошахтинск, ул. Базарная, 26э", fullName: "Ковалёва Татьяна Александровна" },
    { branchName: "Таганрог 1, пер. Спартаковский, 3", fullName: "Кучма Ольга Сергеевна" },
    { branchName: "Шахты 1, пр. Победа Революции, 85", fullName: "Федотова Диана Владимировна" },
    { branchName: "Шахты 2, пр. Ленинского Комсомола, 36", fullName: "Чебан Елена Петровна" },
    { branchName: "Шахты 3, ул. Текстильная, 29Б", fullName: "Овчаренко Светлана Николаевна" }
  ];

  const unassignedUsers = [
    "Рыжиков Владлен Владиславович",
    "Страдецкая Александра Константиновна",
    "Аверкина Ирина Александровна",
    "Гуськова Татьяна Эдуардовна",
    "Бартенева Мариса Никитична",
    "Письменская Татьяна Витальевна",
    "Егорова Татьяна Игоревна",
    "Лившиц Анастасия Валерьевна",
    "Жирова Светлана Андреевна"
  ];

  const defaultPassword = await hash("12345678", 12);
  let phoneCounter = 79000000001;

  console.log("Удаление старых тестовых сотрудников...");
  // Не удаляем Главного Админа
  await prisma.user.deleteMany({
    where: { phone: { not: "79613002646" } } 
  });

  const allBranches = await prisma.branch.findMany();

  console.log("Добавление закрепленных сотрудников...");
  for (const item of usersData) {
    const branch = allBranches.find(b => b.name === item.branchName);
    if (!branch) {
      console.warn(`Филиал не найден для ${item.fullName}: ${item.branchName}`);
      continue;
    }

    await prisma.user.create({
      data: {
        fullName: item.fullName,
        phone: String(phoneCounter++),
        password: defaultPassword,
        role: "EMPLOYEE",
        branchId: branch.id
      }
    });
    console.log(`+ ${item.fullName} -> ${item.branchName}`);
  }

  console.log("Добавление сотрудников на подмену (Выходной)...");
  for (const name of unassignedUsers) {
    await prisma.user.create({
      data: {
        fullName: name,
        phone: String(phoneCounter++),
        password: defaultPassword,
        role: "EMPLOYEE",
        branchId: null
      }
    });
    console.log(`+ ${name} -> Без привязки`);
  }

  console.log("Готово!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
