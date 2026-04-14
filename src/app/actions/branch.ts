"use server"

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import * as xlsx from "xlsx";
import path from "path";
import fs from "fs";

export async function getBranches() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "SENIOR_MANAGER") {
    return { error: "Недостаточно прав" };
  }
  
  const branches = await db.branch.findMany({
    orderBy: { name: "asc" }
  });
  
  return { branches };
}

export async function getPublicBranches() {
  const branches = await db.branch.findMany({
    orderBy: { name: "asc" }
  });
  return { branches };
}

export async function deleteBranch(id: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Недостаточно прав" };

  try {
    await db.branch.delete({ where: { id } });
    revalidatePath("/admin/branches");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function createBranch(data: any) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Недостаточно прав" };

  try {
    await db.branch.create({ data });
    revalidatePath("/admin/branches");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function updateBranch(id: string, data: any) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Недостаточно прав" };

  try {
    await db.branch.update({
      where: { id },
      data
    });
    revalidatePath("/admin/branches");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function syncBranchesNetwork() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Недостаточно прав" };

  try {
    const filePath = path.join(process.cwd(), "scripts", "camera_report.xlsx");
    
    if (!fs.existsSync(filePath)) {
      return { error: "Файл отчета не найден в директории scripts/" };
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const datasheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(datasheet) as any[];

    const branches = await db.branch.findMany();
    let updatedCount = 0;

    for (const row of data) {
      const dbName = row['Название (БД)'];
      const textName = row['Название (из текста)'];
      const rtspUrl = row['RTSP ссылка'];
      const ipAddr = row['IP адрес'];

      if (!rtspUrl || rtspUrl === 'Нет данных' || rtspUrl === '-') continue;

      let targetBranch = branches.find(b => b.name === dbName);
      
      if (!targetBranch && textName && textName !== '-') {
        targetBranch = branches.find(b => b.name.toLowerCase().includes(textName.toLowerCase()));
      }

      if (targetBranch) {
        await db.branch.update({
          where: { id: targetBranch.id },
          data: {
            expectedIp: ipAddr && ipAddr !== '-' ? String(ipAddr) : null,
            rtspUrl: String(rtspUrl)
          }
        });
        updatedCount++;
      }
    }

    revalidatePath("/admin/branches");
    return { success: true, message: `Синхронизация завершена. Обновлено филиалов: ${updatedCount}` };
  } catch (error) {
    console.error("Sync error:", error);
    return { error: String(error) };
  }
}

