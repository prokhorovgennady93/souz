"use server"

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

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
