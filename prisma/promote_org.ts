import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "grevelien@yandex.ru";
  const orgName = "ADR Академия";

  console.log(`--- Назначение роли Организации для ${email} ---`);

  try {
    const user = await (prisma as any).user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`Ошибка: Пользователь с email ${email} не найден в базе данных.`);
      return;
    }

    await (prisma as any).user.update({
      where: { email },
      data: {
        isOrganization: true,
        orgName: orgName,
        hasFullAccess: true // Даем полный доступ самой организации
      },
    });

    console.log(`Успех: Пользователь ${email} теперь является Организацией (${orgName}).`);
    console.log(`Теперь вы можете зайти в раздел "Для организаций" в Личном кабинете.`);
  } catch (error) {
    console.error("Произошла ошибка при обновлении:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
