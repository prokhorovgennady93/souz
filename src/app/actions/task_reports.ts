"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

/**
 * Получает структурированный отчет по задачам за период
 * Группирует одинаковые задачи в одну запись (с учетом даты)
 */
export async function getTaskReports(startDateStr: string, endDateStr: string, query?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);

  // 1. Получаем все задачи, которые попадают в период
  const tasks = await (db as any).task.findMany({
    where: {
      scheduledAt: { gte: start, lte: end },
      // Поиск по названию (регистронезависимый в SQLite/Prisma если настроено)
      title: query ? { contains: query } : undefined,
    },
    include: {
      requirements: true,
      completions: {
        include: {
          user: { include: { branch: true } },
          responses: { include: { requirement: true } }
        }
      }
    },
    orderBy: { scheduledAt: 'desc' }
  });

  // 2. Группируем задачи по названию, описанию И ДАТЕ
  const groupedTasks: Record<string, any[]> = {};
  tasks.forEach((t: any) => {
    const d = new Date(t.scheduledAt);
    const dateKey = d.toISOString().split('T')[0];
    const key = `${t.title}_${t.description || ''}_${dateKey}`.trim();
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(t);
  });

  // 3. Получаем всех активных пользователей для сопоставления
  // (В данном режиме получаем всех, так как фильтр по филиалу убран)
  const allUsers = await db.user.findMany({
    where: { role: { not: "CANDIDATE" } },
    include: { branch: true }
  });

  const reports = Object.entries(groupedTasks).map(([key, group]: [string, any[]]) => {
    const mainTask = group[0];
    const taskIds = group.map(t => t.id);
    const dateStr = new Date(mainTask.scheduledAt).toLocaleDateString('ru-RU');
    const allUserStatuses: any[] = [];

    group.forEach(task => {
      const assignedToThisTask = allUsers.filter(user => {
        if (task.targetAllUsers) return true;
        if (task.assignedUserId === user.id) return true;
        if (task.assignedBranchId && task.assignedBranchId === user.branchId) return true;
        if (task.targetRole === user.role) return true;
        if (task.targetRole === 'SHIFT_MANAGERS' && 
            (user.role === 'EMPLOYEE' || user.role === 'SENIOR_MANAGER') && 
            user.branchId && !user.isOffDay) return true;
        return false;
      });

      assignedToThisTask.forEach(user => {
        if (allUserStatuses.some(u => u.user.id === user.id)) return;
        const completion = task.completions.find((c: any) => c.userId === user.id);
        allUserStatuses.push({
          user: {
            id: user.id,
            fullName: user.fullName,
            branchName: user.branch?.name || "Без филиала",
            role: user.role
          },
          status: completion ? "COMPLETED" : "NOT_COMPLETED",
          completion: completion || null
        });
      });
    });

    return {
      id: mainTask.id,
      taskIds,
      title: mainTask.title,
      description: mainTask.description,
      priority: mainTask.priority,
      date: dateStr,
      scheduledAt: mainTask.scheduledAt,
      completedCount: allUserStatuses.filter(u => u.status === "COMPLETED").length,
      notCompletedCount: allUserStatuses.filter(u => u.status === "NOT_COMPLETED").length,
      userStatuses: allUserStatuses
    };
  });

  // Сортируем: сначала свежие, потом по приоритету
  reports.sort((a, b) => {
    const dateA = new Date(a.scheduledAt).getTime();
    const dateB = new Date(b.scheduledAt).getTime();
    if (dateB !== dateA) return dateB - dateA;
    
    const pPriority: Record<string, number> = { 'URGENT': 0, 'HIGH': 1, 'NORMAL': 2, 'LOW': 3 };
    return (pPriority[a.priority] || 2) - (pPriority[b.priority] || 2);
  });

  return { reports };
}


/**
 * Полное удаление группы задач и всех связанных с ними данных
 */
export async function deleteTaskReport(taskIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };
  
  try {
    // Удаляем все задачи по списку ID
    await (db as any).task.deleteMany({
      where: { id: { in: taskIds } }
    });
    
    revalidatePath("/admin/tasks/reports");
    return { success: true };
  } catch (error: any) {
    return { error: `Ошибка при удалении: ${error.message}` };
  }
}

