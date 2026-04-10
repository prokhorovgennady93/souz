import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as xlsx from 'xlsx';
import { auth } from '../../../../../../auth';
const ROLE_MAP: Record<string, string> = {
  ADMIN: "Администратор",
  SENIOR_MANAGER: "Старший менеджер",
  EMPLOYEE: "Сотрудник",
  CANDIDATE: "Стажер",
};

export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "SENIOR_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.user.findMany({
    include: { branch: true },
    orderBy: { fullName: "asc" }
  });

  const data = users.map((u: any) => ({
    "ФИО": u.fullName,
    "Телефон": u.phone,
    "Роль": ROLE_MAP[u.role] || u.role,
    "Выходной": u.isOffDay ? "Да" : "Нет",
    "Название Филиала": u.branch ? u.branch.name : "Без привязки (Выходной/Закрыт)",
    "Время работы (напр. 08:00 - 20:00)": u.workTimeStart ? `${u.workTimeStart} - ${u.workTimeEnd}` : (u.branch ? `${u.branch.openTime} - ${u.branch.closeTime}` : ""),
    "Перерыв (напр. 12:00 - 13:00)": u.breakTimeStart ? `${u.breakTimeStart} - ${u.breakTimeEnd}` : (u.branch ? `${u.branch.breakStartTime} - ${u.branch.breakEndTime}` : "")
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Сотрудники");
  
  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": 'attachment; filename="Employees.xlsx"',
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  });
}
