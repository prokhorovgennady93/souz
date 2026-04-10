"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

/**
 * Удаляет запись аудита и связанные с ней файлы изображений
 */
export async function deleteAudit(auditId: string) {
  try {
    // 1. Находим запись, чтобы получить пути к файлам
    const audit = await db.shiftAudit.findUnique({
      where: { id: auditId }
    });

    if (!audit) throw new Error("Аудит не найден");

    // 2. Удаляем файлы с диска, если они существуют
    const imageFields = ['imageUrl1', 'imageUrl2', 'imageUrl3'] as const;
    const publicDir = path.resolve(process.cwd(), "public");

    imageFields.forEach(field => {
      const imgPath = audit[field];
      if (imgPath) {
        const fullPath = path.join(publicDir, imgPath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            console.error(`Failed to delete file: ${fullPath}`, e);
          }
        }
      }
    });

    // 3. Удаляем запись из БД
    await db.shiftAudit.delete({
      where: { id: auditId }
    });

    // 4. Обновляем UI
    revalidatePath("/admin/monitoring");

    return { success: true };
  } catch (error) {
    console.error("Delete audit error:", error);
    return { error: "Не удалось удалить событие" };
  }
}
