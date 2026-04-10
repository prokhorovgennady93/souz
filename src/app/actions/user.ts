"use server"

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function getUsers() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "SENIOR_MANAGER") {
    return { error: "Недостаточно прав" };
  }
  
  const users = await db.user.findMany({
    include: { branch: true },
    orderBy: { fullName: "asc" }
  });
  
  return { users };
}

export async function updateUserBranch(userId: string, branchId: string | null) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "SENIOR_MANAGER") return { error: "Недостаточно прав" };

  try {
    await db.user.update({
      where: { id: userId },
      data: { branchId }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function updateUser(userId: string, data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "SENIOR_MANAGER") return { error: "Недостаточно прав" };

  try {
    if (data.password) {
      data.plainPassword = data.password;
      data.password = await hash(data.password, 12);
    } else {
      delete data.password;
    }

    await db.user.update({
      where: { id: userId },
      data
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function deleteUser(userId: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "SENIOR_MANAGER") return { error: "Недостаточно прав" };

  try {
    await db.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function createUser(data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "SENIOR_MANAGER") return { error: "Недостаточно прав" };

  try {
    const plainPassword = data.password || "123456";
    const password = await hash(plainPassword, 12);
    await db.user.create({
      data: { ...data, password, plainPassword }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}
