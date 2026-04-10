import { DatabaseSync } from "node:sqlite";

function main() {
  const args = process.argv.slice(2);
  const phoneIdx = args.indexOf('--phone');
  const emailIdx = args.indexOf('--email');
  
  let userIdentifier = "";
  let field = "";

  if (phoneIdx !== -1 && args[phoneIdx + 1]) {
    userIdentifier = args[phoneIdx + 1];
    field = "phone";
  } else if (emailIdx !== -1 && args[emailIdx + 1]) {
    userIdentifier = args[emailIdx + 1];
    field = "email";
  } else {
    console.log("Использование: npx tsx prisma/make_admin.ts --phone 79991234455 ИЛИ --email user@test.ru");
    return;
  }

  console.log(`--- Назначение прав АДМИНИСТРАТОРА для ${userIdentifier} ---`);

  try {
    const dbPath = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('file:', '') : "prisma/data/prod.db";
    const db = new DatabaseSync(dbPath);

    const checkStmt = db.prepare(`SELECT id FROM User WHERE ${field} = ?`);
    const user = checkStmt.get(userIdentifier);

    if (!user) {
      console.error(`Ошибка: Пользователь ${userIdentifier} не найден в БД: ${dbPath}`);
      return;
    }

    const updateStmt = db.prepare(`UPDATE User SET isAdmin = 1, hasFullAccess = 1 WHERE ${field} = ?`);
    updateStmt.run(userIdentifier);

    console.log(`Успех: Пользователь ${userIdentifier} теперь АДМИНИСТРАТОР.`);
  } catch (error) {
    console.error("Ошибка при обновлении (возможно неверный путь к БД):", error);
  }
}

main();
