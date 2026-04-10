"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

/**
 * Синхронизирует просроченные задачи и превращает их в записи штрафов
 */
async function syncAutomaticPenalties() {
  const now = new Date();

  // 1. Ищем все просроченные и невыполненные задачи
  const overdueTasks = await (db as any).task.findMany({
    where: {
      deadline: { lt: now },
      points: { gt: 0 }
    },
    include: {
      completions: { select: { userId: true } }
    }
  });

  for (const task of overdueTasks) {
    let targetUserIds: string[] = [];

    if (task.targetAllUsers) {
      const allUsers = await db.user.findMany({ select: { id: true } });
      targetUserIds = allUsers.map(u => u.id);
    } else if (task.targetRole) {
      const roleUsers = await db.user.findMany({ where: { role: task.targetRole }, select: { id: true } });
      targetUserIds = roleUsers.map(u => u.id);
    } else if (task.assignedBranchId) {
      const branchUsers = await db.user.findMany({ where: { branchId: task.assignedBranchId }, select: { id: true } });
      targetUserIds = branchUsers.map(u => u.id);
    } else if (task.assignedUserId) {
      targetUserIds = [task.assignedUserId];
    }

    // Создаем штрафы для всех, у кого их еще нет за эту задачу И кто её не выполнил
    for (const userId of targetUserIds) {
      // ПРОВЕРКА: Если пользователь выполнил задачу — штраф не нужен
      const didComplete = task.completions.some((c: any) => c.userId === userId);
      if (didComplete) continue;

      const existing = await db.penalty.findFirst({
        where: { userId, taskId: task.id }
      });

      if (!existing) {
        await db.penalty.create({
          data: {
            userId,
            taskId: task.id,
            amount: task.points,
            reason: `Просрочена задача: ${task.title}`,
            type: 'TASK_OVERDUE',
            createdAt: task.deadline // Фиксируем штраф датой дедлайна
          }
        });
      }
    }
  }
}

/**
 * Получает сумму штрафных баллов сотрудника за текущий месяц
 */
export async function getPenaltySummary() {
  const session = await auth();
  if (!session?.user?.id) return { total: 0, details: [] };

  // Перед показом синхронизируем (чтобы сотрудник сразу видел актуальный штраф)
  await syncAutomaticPenalties();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const penalties = await db.penalty.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: monthStart }
    },
    orderBy: { createdAt: 'desc' }
  });

  const total = penalties.reduce((sum, p) => sum + p.amount, 0);

  return {
    total,
    penalties
  };
}

/**
 * Добавляет штраф вручную (для админов)
 */
export async function addManualPenalty(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return { error: "Нет прав" };
  }

  const userId = formData.get("userId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const reason = formData.get("reason") as string;

  if (!userId || !amount || !reason) return { error: "Заполните все поля" };

  await db.penalty.create({
    data: {
      userId,
      amount,
      reason,
      type: 'MANUAL'
    }
  });

  revalidatePath("/admin/penalties");
  return { success: true };
}

/**
 * Удаление штрафа
 */
export async function deletePenalty(id: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Нет прав" };

  await db.penalty.delete({ where: { id } });
  revalidatePath("/admin/penalties");
  return { success: true };
}

/**
 * Изменение штрафа
 */
export async function updatePenalty(id: string, amount: number, reason: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Нет прав" };

  await db.penalty.update({
    where: { id },
    data: { amount, reason }
  });

  revalidatePath("/admin/penalties");
  return { success: true };
}

/**
 * Получает лог штрафов для админа
 */
export async function getPenaltyLog(monthOffset: number = 0) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return [];

  // Синхронизируем автоматические штрафы перед просмотром журнала
  await syncAutomaticPenalties();

  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);

  const penalties = await db.penalty.findMany({
    where: {
      createdAt: { gte: monthStart, lte: monthEnd }
    },
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return penalties;
}
