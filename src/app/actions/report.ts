"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { startOfDay, endOfDay, differenceInMinutes, format } from "date-fns";

/**
 * Получает сводный отчет по работе менеджеров (опоздания, перерывы)
 */
export async function getManagerWorkReport(startDate: Date, endDate: Date) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return { error: "Нет прав" };
  }

  const shifts = await db.shift.findMany({
    where: {
      openedAt: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    include: {
      user: { select: { id: true, fullName: true, workTimeStart: true } },
      branch: { 
        include: { 
          scheduleOverrides: {
            where: {
              date: {
                gte: startOfDay(startDate),
                lte: endOfDay(endDate),
              }
            }
          }
        } 
      },
      breaks: true,
    },
    // Сортировка по возрастанию, чтобы первой обработать ПЕРВУЮ смену за день
    orderBy: { openedAt: 'asc' }
  });

  const userOverrides = await db.userScheduleOverride.findMany({
    where: {
      date: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      }
    }
  });

  // Группировка по менеджеру
  const managerStats: Record<string, any> = {};
  
  // Трекаем дни во избежание двойного штрафа за перезаходы и корректного счета отработанных дней
  const processedDays: Record<string, boolean> = {};

  shifts.forEach(shift => {
    const userId = shift.userId;
    if (!managerStats[userId]) {
      managerStats[userId] = {
        fullName: shift.user.fullName,
        shiftCount: 0, // По факту это "отработанные дни" для правильного среднего
        totalLateness: 0,
        totalBreakTime: 0,
        totalBreakCount: 0,
        shifts: []
      };
    }

    const stats = managerStats[userId];
    const dateStr = format(shift.openedAt, "yyyy-MM-dd");
    const dayKey = `${userId}-${dateStr}`;

    // --- РАСЧЕТ ОПОЗДАНИЯ ---
    const override = shift.branch.scheduleOverrides.find(ov => format(ov.date, "yyyy-MM-dd") === dateStr);
    const userOverride = userOverrides.find(ov => ov.userId === userId && format(ov.date, "yyyy-MM-dd") === dateStr);
    
    // Приоритеты: 1. Переопределение юзера -> 2. Юзер профиль -> 3. Переопределение филиала -> 4. Расписание филиала
    const targetOpenStr = userOverride?.workTimeStart || shift.user.workTimeStart || override?.openTime || shift.branch.openTime;
    const isClosed = userOverride?.isOffDay || override?.isClosed || false;

    let lateness = 0;
    
    // Опоздание и день смены засчитываем только 1 раз в сутки при первой открытой смене
    if (!processedDays[dayKey]) {
      stats.shiftCount += 1; // Увеличиваем счетчик рабочих дней
      
      if (!isClosed && targetOpenStr) {
        // Переводим плановое и фактическое время в "минуты от начала дня" для точности
        const [targetH, targetM] = targetOpenStr.split(':').map(Number);
        const targetMinutes = targetH * 60 + targetM;

        const actualH = shift.openedAt.getHours();
        const actualM = shift.openedAt.getMinutes();
        const actualMinutes = actualH * 60 + actualM;

        const diff = actualMinutes - targetMinutes;
        if (diff > 0) lateness = diff;
      }
      
      processedDays[dayKey] = true;
      stats.totalLateness += lateness;
    }

    // --- РАСЧЕТ ПЕРЕРЫВОВ ---
    let shiftBreakTime = 0;
    shift.breaks.forEach(b => {
      if (b.startedAt && b.endedAt) {
        shiftBreakTime += differenceInMinutes(b.endedAt, b.startedAt);
      }
    });

    stats.totalBreakTime += shiftBreakTime;
    stats.totalBreakCount += shift.breaks.length;
    
    stats.shifts.push({
      date: dateStr,
      openedAt: shift.openedAt,
      // В историю смен сохраняем опоздание только если оно было начислено в этой смене
      lateness, 
      breakTime: shiftBreakTime,
      breakCount: shift.breaks.length
    });
  });

  return { success: true, data: Object.values(managerStats) };
}
