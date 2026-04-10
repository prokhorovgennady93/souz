"use server";

import { db } from "@/lib/db";
import { format, startOfDay, endOfDay } from "date-fns";
import { ru } from "date-fns/locale";

export type PublicScheduleItem = {
  id: string;
  branchName: string;
  employeeName: string;
  employeePhone: string;
  workSchedule: string;
  breakSchedule: string;
  status: string;
  statusType: "open" | "closed" | "break";
};

export async function getPublicSchedule(dateStr: string): Promise<PublicScheduleItem[]> {
  const targetDate = new Date(dateStr);
  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  // 1. Получаем все филиалы и смены за этот день
  const branches = await db.branch.findMany({
    include: {
      shifts: {
        where: {
          openedAt: { gte: start, lte: end }
        },
        include: { breaks: true },
        orderBy: { openedAt: "desc" }
      }
    },
    orderBy: { name: "asc" }
  });

  // 2. Получаем всех сотрудников
  const users = await db.user.findMany({
    where: { role: { in: ["EMPLOYEE", "SENIOR_MANAGER"] } }
  });

  // 3. Получаем переопределения расписаний на этот день
  const overrides = await db.userScheduleOverride.findMany({
    where: { date: start }
  });

  // Объединяем профиль с переопределениями на дату
  const userMap = new Map();
  for (const user of users) {
    const ovr = overrides.find(o => o.userId === user.id);
    userMap.set(user.id, {
      ...user,
      activeBranchId: ovr ? ovr.branchId : user.branchId,
      workTimeStart: (ovr && ovr.workTimeStart) ? ovr.workTimeStart : user.workTimeStart,
      workTimeEnd: (ovr && ovr.workTimeEnd) ? ovr.workTimeEnd : user.workTimeEnd,
      breakTimeStart: (ovr && ovr.breakTimeStart) ? ovr.breakTimeStart : user.breakTimeStart,
      breakTimeEnd: (ovr && ovr.breakTimeEnd) ? ovr.breakTimeEnd : user.breakTimeEnd,
      isOffDay: ovr ? ovr.isOffDay : user.isOffDay
    });
  }

  return branches.map(branch => {
    // Сотрудники, привязанные к этому филиалу в выбранную дату
    const branchUsers = Array.from(userMap.values()).filter(u => u.activeBranchId === branch.id && !u.isOffDay);
    
    // Берем первого сотрудника для отображения (по графику обычно 1 админ на филиал, но если есть несколько, показываем первого)
    const employee = branchUsers[0] || null;
    let status = "Смена не открыта";
    let statusType: "open" | "closed" | "break" = "closed";
    
    // Ищем фактическую смену
    let shift = null;
    if (employee) {
      shift = branch.shifts.find(s => s.userId === employee.id);
    }
    // Если смены от конкретного сотрудника нет, но вдруг филиал открывал кто-то другой
    if (!shift && branch.shifts.length > 0) {
      shift = branch.shifts[0];
    }

    if (shift) {
      const openTime = format(new Date(shift.openedAt), "HH:mm");
      status = `Смена открыта в ${openTime}`;
      statusType = "open";
      
      const currentBreak = shift.breaks.find(b => b.endedAt === null);
      if (currentBreak) {
         status = `Перерыв с ${format(new Date(currentBreak.startedAt), "HH:mm")}`;
         statusType = "break";
      } else if (shift.closedAt) {
         status = "Смена закрыта"; 
         statusType = "closed";
      }
    }

    return {
      id: branch.id,
      branchName: branch.name,
      employeeName: employee?.fullName || "Не назначен",
      employeePhone: employee?.phone || "-",
      workSchedule: employee ? `${employee.workTimeStart || branch.openTime} - ${employee.workTimeEnd || branch.closeTime}` : `${branch.openTime} - ${branch.closeTime}`,
      breakSchedule: employee ? `${employee.breakTimeStart || branch.breakStartTime} - ${employee.breakTimeEnd || branch.breakEndTime}` : `${branch.breakStartTime} - ${branch.breakEndTime}`,
      status,
      statusType
    };
  });
}
