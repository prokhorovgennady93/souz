"use server";

import { db } from "@/lib/db";
import { startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getUserOverrides(dateStr: string) {
  const date = startOfDay(new Date(dateStr));

  const overrides = await db.userScheduleOverride.findMany({
    where: { date },
    include: { branch: true }
  });

  return overrides;
}

export async function saveUserOverride(userId: string, dateStr: string, data: any) {
  try {
    const date = startOfDay(new Date(dateStr));

    // If all fields are null/false and branchId is also null, it might be better to just delete the override,
    // but the prompt specifies that "No branch" is an explicit offday/replacement state.
    // If the admin explicitly selects "none" branch, branchId is null.
    // If they delete the override completely, they would choose "По графику" (handled below).

    if (data.clearOverride) {
      await db.userScheduleOverride.deleteMany({
        where: { userId, date }
      });
    } else {
      await db.userScheduleOverride.upsert({
        where: {
          userId_date: {
            userId,
            date
          }
        },
        update: {
          branchId: data.branchId === "none" ? null : data.branchId,
          workTimeStart: data.workTimeStart || null,
          workTimeEnd: data.workTimeEnd || null,
          breakTimeStart: data.breakTimeStart || null,
          breakTimeEnd: data.breakTimeEnd || null,
          isOffDay: data.isOffDay || false,
        },
        create: {
          userId,
          date,
          branchId: data.branchId === "none" ? null : data.branchId,
          workTimeStart: data.workTimeStart || null,
          workTimeEnd: data.workTimeEnd || null,
          breakTimeStart: data.breakTimeStart || null,
          breakTimeEnd: data.breakTimeEnd || null,
          isOffDay: data.isOffDay || false,
        }
      });
    }

    revalidatePath("/admin/users");
    revalidatePath("/schedule");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save schedule override:", error);
    return { error: error.message };
  }
}
