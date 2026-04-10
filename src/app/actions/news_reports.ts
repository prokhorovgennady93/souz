"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { startOfDay, endOfDay, format } from "date-fns";
import { ru } from "date-fns/locale";

export async function getNewsReports(fromStr: string, toStr: string, queryStr?: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return { error: "Нет прав" };
  }

  const fromDate = startOfDay(new Date(fromStr));
  const toDate = endOfDay(new Date(toStr));

  try {
    // 1. Получаем всех целевых сотрудников (которые должны читать новости)
    // Активные пользователи (EMPLOYEE и SENIOR_MANAGER)
    const targetUsers = await db.user.findMany({
      where: {
        role: { in: ["EMPLOYEE", "SENIOR_MANAGER"] }
      },
      select: { id: true, fullName: true, branchId: true }
    });

    // 2. Получаем новости за период
    const newsItems = await db.news.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate
        },
        ...(queryStr ? {
          title: { contains: queryStr }
        } : {})
      },
      include: {
        confirmations: {
          include: {
            user: { select: { id: true, fullName: true, role: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Форматируем отчет
    const reports = newsItems.map(news => {
      const readUsersMap = new Set(news.confirmations.map(c => c.userId));
      
      const readBy = news.confirmations.map(c => ({
        id: c.userId,
        fullName: c.user.fullName,
        readAt: format(new Date(c.readAt), "dd MMM HH:mm", { locale: ru })
      }));

      // Те, кто не прочитал - это пересечение целевых пользователей и (минус) тех, кто прочитал
      // Если новость предназначена конкретному department, можно расширять логику здесь.
      // Пока считаем, что все сотрудники из targetUsers должны прочитать.
      const unreadBy = targetUsers
        .filter(u => !readUsersMap.has(u.id))
        .map(u => ({
          id: u.id,
          fullName: u.fullName
        }));

      return {
        id: news.id,
        title: news.title,
        contentPreview: news.content.substring(0, 100).replace(/[#*`]/g, '') + (news.content.length > 100 ? "..." : ""),
        date: format(new Date(news.createdAt), "dd.MM.yyyy", { locale: ru }),
        department: news.department,
        readCount: readBy.length,
        unreadCount: unreadBy.length,
        readBy,
        unreadBy
      };
    });

    return { reports };
  } catch (err: any) {
    console.error("News report error:", err);
    return { error: err.message };
  }
}

export async function deleteNews(newsIds: string[]) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Нет прав" };

  try {
    await db.news.deleteMany({
      where: { id: { in: newsIds } }
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
