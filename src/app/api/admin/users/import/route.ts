import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as xlsx from 'xlsx';
import { auth } from '../../../../../../auth';
import { hash } from 'bcryptjs';

const REVERSE_ROLE_MAP: Record<string, string> = {
  "Администратор": "ADMIN",
  "Старший менеджер": "SENIOR_MANAGER",
  "Сотрудник": "EMPLOYEE",
  "Стажер": "CANDIDATE",
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "SENIOR_MANAGER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Файл не найден" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    let updated = 0;
    let created = 0;
    const defaultPlainPassword = "123456";
    const defaultPassword = await hash(defaultPlainPassword, 12);

    for (const row of jsonData as any[]) {
      let phoneRaw = String(row["Телефон"] || "").trim();
      let phone = phoneRaw.replace(/\D/g, ''); // Нормализация номера
      if (!phone) continue;

      const fullName = String(row["ФИО"] || "").trim();
      
      let branchId = null;
      let branchNameField = row["Название Филиала"];
      let branchName = branchNameField && String(branchNameField).trim() !== "" ? String(branchNameField).trim() : null;
      if (branchName && branchName !== "Без привязки (Выходной/Закрыт)") {
        const matchingBranch = await db.branch.findFirst({ where: { name: branchName } });
        if (matchingBranch) branchId = matchingBranch.id;
      }
      
      let russianRole = row["Роль"] || "Сотрудник";
      let roleVal = REVERSE_ROLE_MAP[russianRole] || "EMPLOYEE";
      
      let isOffDay = String(row["Выходной"] || "").toLowerCase() === "да";

      const workStr = row["Время работы (напр. 08:00 - 20:00)"] || "";
      let workTimeStart = null, workTimeEnd = null;
      if (workStr.includes("-")) {
        workTimeStart = workStr.split("-")[0].trim();
        workTimeEnd = workStr.split("-")[1].trim();
      }

      const breakStr = row["Перерыв (напр. 12:00 - 13:00)"] || "";
      let breakTimeStart = null, breakTimeEnd = null;
      if (breakStr.includes("-")) {
        breakTimeStart = breakStr.split("-")[0].trim();
        breakTimeEnd = breakStr.split("-")[1].trim();
      }

      const existing = await db.user.findUnique({ where: { phone } });
      if (existing) {
        await db.user.update({
          where: { phone },
          data: { fullName, branchId, role: roleVal, workTimeStart, workTimeEnd, breakTimeStart, breakTimeEnd, isOffDay }
        });
        updated++;
      } else {
        await db.user.create({
          data: { phone, fullName, branchId, role: roleVal, password: defaultPassword, plainPassword: defaultPlainPassword, workTimeStart, workTimeEnd, breakTimeStart, breakTimeEnd, isOffDay }
        });
        created++;
      }
    }

    return NextResponse.json({ success: true, message: `Обработка завершена! Обновлено: ${updated}, Создано новых: ${created}` });
  } catch (error) {
    console.error("Excel Import Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
