"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

import path from "path";
import fs from "fs";

/**
 * Создает новость компании
 */
export async function createNews(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };

  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isImportant = formData.get("isImportant") === "true";
    const department = formData.get("department") as string;
    
    // Файлы
    const imageFile = formData.get("image") as File;
    const videoFile = formData.get("video") as File;

    let imageUrl = null;
    let videoUrl = null;

    const uploadDir = path.resolve(process.cwd(), "public/uploads/news");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    if (imageFile && imageFile.size > 0) {
      const fileName = `img_${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      imageUrl = `/uploads/news/${fileName}`;
    }

    if (videoFile && videoFile.size > 0) {
      const fileName = `vid_${Date.now()}_${videoFile.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      videoUrl = `/uploads/news/${fileName}`;
    }

    await db.news.create({
      data: {
        title,
        content,
        isImportant,
        department,
        imageUrl,
        videoUrl,
        creatorId: session.user.id,
      }
    });

    revalidatePath("/tasks");
    return { success: true };
  } catch (error: any) {
    console.error("CREATE_NEWS_ERROR:", error);
    return { error: error.message || "Ошибка при создании новости" };
  }
}

/**
 * Подтверждает ознакомление с новостью
 */
export async function confirmNewsRead(newsId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };

  await db.newsConfirmation.upsert({
    where: {
      newsId_userId: {
        newsId,
        userId: session.user.id,
      }
    },
    update: {},
    create: {
      newsId,
      userId: session.user.id,
    }
  });

  revalidatePath("/tasks");
  return { success: true };
}

/**
 * Получает новости для пользователя с информацией о прочтении и фильтрами
 */
export async function getCompanyNews(filters?: { from?: string; to?: string; department?: string; onlyUnread?: boolean }) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const where: any = {};
  
  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters.from) {
      const start = new Date(filters.from);
      start.setHours(0, 0, 0, 0);
      where.createdAt.gte = start;
    }
    if (filters.to) {
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (filters?.department && filters.department !== "all") {
    where.department = filters.department;
  }

  if (filters?.onlyUnread) {
    where.confirmations = {
      none: { userId: session.user.id }
    };
  }

  const news = await db.news.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      confirmations: {
        where: { userId: session.user.id }
      },
      creator: { include: { branch: true } },
    }
  });

  return news.map(item => ({
    ...item,
    isRead: item.confirmations.length > 0
  }));
}

/**
 * Удаляет новость
 */
export async function deleteNews(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };
  
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== 'ADMIN' && user.role !== 'OWNER')) {
    return { error: "Нет прав для удаления" };
  }

  await db.news.delete({ where: { id } });
  revalidatePath("/tasks");
  return { success: true };
}

