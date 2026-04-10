"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { conductShiftAudit, getClientIp } from "@/lib/audit";

export async function getCurrentShift() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован", shift: null };

  const shift = await db.shift.findFirst({
    where: {
      userId: session.user.id,
      closedAt: null,
    },
    include: {
      breaks: true,
    },
    orderBy: {
      openedAt: "desc",
    },
  });

  if (shift) {
    const now = new Date();
    const isSameDay = shift.openedAt.toDateString() === now.toDateString();
    
    if (!isSameDay) {
      // ПАССИВНОЕ АВТОЗАКРЫТИЕ: смена с прошлого дня
      await db.shift.update({
        where: { id: shift.id },
        data: {
          closedAt: now,
          autoClosed: true
        }
      });
      // Закрываем перерывы
      await db.shiftBreak.updateMany({
        where: { shiftId: shift.id, endedAt: null },
        data: { endedAt: now }
      });
      console.log(`[SHIFT] Passive Auto-closed orphaned shift ${shift.id} for user ${session.user.id}`);
      return { shift: null };
    }
  }

  return { shift };
}

export async function startShift(overrideBranchId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };
  
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "Пользователь не найден" };

  const today = new Date();
  // startOfDay in local time equivalent
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const override = await db.userScheduleOverride.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: startOfToday
      }
    }
  });

  const isOffDay = override ? override.isOffDay : user.isOffDay;
  if (isOffDay) return { error: "Вы находитесь на выходном и не можете открыть смену" };

  const branchId = overrideBranchId || (override ? override.branchId : (user as any).branchId);
  if (!branchId) return { error: "Вы не привязаны ни к одному филиалу на сегодня." };

  // IP Check (Logging only for now)
  const clientIp = await getClientIp();
  const branch = await db.branch.findUnique({ where: { id: branchId } });
  const isIpMatch = branch?.expectedIp ? clientIp === branch.expectedIp : true;
  
  // NOTE: Blocking is disabled for local tests as per user request
  // if (!isIpMatch) return { error: `Ошибка доступа. Ваш IP (${clientIp}) не совпадает с IP филиала.` };

  // Проверяем, нет ли уже открытой смены
  const existing = await db.shift.findFirst({
    where: { userId: session.user.id, closedAt: null }
  });

  if (existing) {
    const now = new Date();
    const isSameDay = existing.openedAt.toDateString() === now.toDateString();
    
    if (isSameDay) {
      return { error: "Смена уже открыта!" };
    } else {
      // ПРИНУДИТЕЛЬНО ЗАКРЫВАЕМ СТАРУЮ СМЕНУ (она с другого дня)
      await db.shift.update({
        where: { id: existing.id },
        data: {
          closedAt: now,
          autoClosed: true
        }
      });
      // Также закрываем все открытые перерывы в этой смене
      await db.shiftBreak.updateMany({
        where: { shiftId: existing.id, endedAt: null },
        data: { endedAt: now }
      });
      console.log(`[SHIFT] Auto-closed orphaned shift ${existing.id} for user ${user.id}`);
    }
  }

  const shift = await db.shift.create({
    data: {
      userId: session.user.id,
      branchId: branchId,
    }
  });

  // Trigger Audit (Awaited for the first frame)
  await conductShiftAudit(shift.id, "START");

  revalidatePath("/branch");
  return { success: true, shift };
}

export async function endShift(shiftId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };

  // Проверяем нет ли открытых перерывов
  const shift = await db.shift.findUnique({
    where: { id: shiftId },
    include: { breaks: { where: { endedAt: null } } }
  });

  if (!shift) return { error: "Смена не найдена" };
  if (shift.breaks.length > 0) return { error: "Сначала завершите текущий перерыв!" };

  await db.shift.update({
    where: { id: shiftId },
    data: { closedAt: new Date() }
  });

  revalidatePath("/branch");
  return { success: true };
}

export async function startBreak(shiftId: string, reason: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };

  await db.shiftBreak.create({
    data: {
      shiftId,
      reason,
    }
  });

  revalidatePath("/branch");
  return { success: true };
}

export async function endBreak(breakId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };

  await db.shiftBreak.update({
    where: { id: breakId },
    data: { endedAt: new Date() }
  });

  // Trigger Audit for return from break
  const b = await db.shiftBreak.findUnique({ where: { id: breakId } });
  if (b) await conductShiftAudit(b.shiftId, "BREAK_END");

  revalidatePath("/branch");
  return { success: true };
}
