import { db } from "../src/lib/db";
import { conductShiftAudit } from "../src/lib/audit";
import fs from "fs";
import path from "path";

// Мы должны имитировать заголовки для Next.js (getClientIp)
// В обычном скрипте это может упасть, поэтому в audit.ts я добавил поддержку дефолтного IP
// Но для чистоты эксперимента мы просто запускаем

async function testFullAudit() {
  console.log("--- Начало полного теста аудита ---");

  // 1. Ищем филиал Горького, который мы недавно настраивали
  const branch = await db.branch.findFirst({
    where: { name: { contains: "Горького" } }
  });

  if (!branch || !branch.rtspUrl) {
    console.error("❌ Тест прерван: Филиал Горького не найден или не настроен.");
    return;
  }

  // 2. Ищем любого сотрудника для теста (или берем первого попавшегося)
  const user = await db.user.findFirst();
  if (!user) {
    console.error("❌ Тест прерван: В базе нет пользователей.");
    return;
  }

  console.log(`Используем филиал: ${branch.name}`);
  console.log(`Используем сотрудника: ${user.fullName}`);

  // 3. Создаем тестовую смену
  const shift = await db.shift.create({
    data: {
      userId: user.id,
      branchId: branch.id,
    }
  });

  console.log(`✅ Тестовая смена создана: ${shift.id}`);

  // 4. Запускаем аудит (имитируем Начало смены)
  console.log("Запуск аудита (ожидаем первый кадр)...");
  const audit = await conductShiftAudit(shift.id, "TEST_ACTION");

  if (audit) {
    console.log(`✅ Запись аудита создана: ${audit.id}`);
  } else {
    console.error("❌ Ошибка: Аудит не вернул результат.");
  }

  // 5. Ждем немного, чтобы фоновые кадры (5 и 10 сек) тоже попробовали сняться
  console.log("Ждем 12 секунд для завершения фоновых кадров...");
  await new Promise(resolve => setTimeout(resolve, 12000));

  // 6. Проверяем наличие файлов
  const logPath = path.resolve(process.cwd(), "public/ffmpeg_debug.log");
  if (fs.existsSync(logPath)) {
    console.log("\n--- СОДЕРЖИМОЕ ЛОГА FFmpeg ---");
    console.log(fs.readFileSync(logPath, "utf-8").slice(-1000));
  } else {
    console.log("❌ Файл лога не создан.");
  }

  console.log("\n--- Проверка файлов снимков ---");
  const publicDir = path.resolve(process.cwd(), "public/uploads/audits");
  const files = fs.readdirSync(publicDir).filter(f => f.includes(audit?.id || "---"));
  
  if (files.length > 0) {
    console.log(`✅ Найдено файлов для этого аудита: ${files.length}`);
    files.forEach(f => console.log(` - ${f}`));
  } else {
    console.log("❌ Файлы снимков не найдены.");
  }

  console.log("\n--- Завершение теста ---");
}

testFullAudit()
  .catch(e => console.error(e))
  .finally(() => db.$disconnect());
