"use server";

import { db } from "@/lib/db";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";

/**
 * Создает новую задачу с динамическими требованиями
 */
export async function createTask(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Не авторизован" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const targetRole = formData.get("targetRole") as string;
    const targetAllUsers = formData.get("targetAllUsers") === "true";
    const branchId = formData.get("branchId") as string;
    const userIdRaw = formData.get("userId") as string;
    const userIds = userIdRaw ? userIdRaw.split(",") : [];
    const points = parseFloat(formData.get("points") as string || "0");

    // Дата дедлайна (конец указанного дня)
    const deadlineRaw = formData.get("deadline") as string;
    const deadline = deadlineRaw ? new Date(new Date(deadlineRaw).setHours(23, 59, 59, 999)) : null;

    // Инструкция в виде фото
    const instructionPhoto = formData.get("instructionPhoto") as File;
    let instructionImageUrl = null;

    if (instructionPhoto && instructionPhoto.size > 0) {
      const uploadDir = path.resolve(process.cwd(), "public/uploads/instructions");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      
      const fileName = `inst_${Date.now()}_${instructionPhoto.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await instructionPhoto.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      instructionImageUrl = `/uploads/instructions/${fileName}`;
    }

    const requirementsRaw = formData.get("requirements") as string;
    const requirements = JSON.parse(requirementsRaw || "[]");
    const isRecurrent = formData.get("isRecurrent") === "true";

    if (isRecurrent) {
      const frequency = formData.get("frequency") as string;
      const dayOfWeek = formData.get("dayOfWeek") ? parseInt(formData.get("dayOfWeek") as string) : null;
      const dayOfMonth = formData.get("dayOfMonth") ? parseInt(formData.get("dayOfMonth") as string) : null;

      const template = await (db as any).taskTemplate.create({
        data: {
          title,
          description,
          priority,
          creatorId: session.user.id,
          targetAllUsers,
          targetRole: targetRole || null,
          assignedBranchId: branchId || null,
          assignedUserId: userIds.length === 1 ? userIds[0] : null,
          instructionImageUrl,
          points,
          frequency,
          dayOfWeek,
          dayOfMonth,
          requirements: {
            create: requirements.map((req: any, index: number) => ({
              type: req.type,
              label: req.label,
              isRequired: req.isRequired ?? true,
              order: index,
            }))
          }
        }
      });

      if (userIds.length > 1) {
         await createTasksForUsers({
           title, description, priority, creatorId: session.user.id,
           points, instructionImageUrl, templateId: template.id, scheduledAt: new Date(), deadline
         }, userIds, requirements);
      }
      
      await syncTasksFromTemplates();
      revalidatePath("/admin/tasks");
      return { success: true };
    } else {
      const baseTaskData = {
        title,
        description,
        priority,
        creatorId: session.user.id,
        targetAllUsers,
        targetRole: targetRole || null,
        assignedBranchId: branchId || null,
        instructionImageUrl,
        points,
        scheduledAt: new Date(),
        deadline,
      };

      if (userIds.length > 1) {
         await createTasksForUsers(baseTaskData, userIds, requirements);
      } else {
        await (db as any).task.create({
          data: {
            ...baseTaskData,
            assignedUserId: userIds[0] || null,
            requirements: {
              create: requirements.map((req: any, index: number) => ({
                type: req.type,
                label: req.label,
                isRequired: req.isRequired ?? true,
                order: index,
              }))
            }
          }
        });
      }
      
      revalidatePath("/admin/tasks");
      return { success: true };
    }
  } catch (error: any) {
    console.error("CREATE_TASK_ERROR:", error);
    return { error: error.message || "Ошибка сервера" };
  }
}

export async function updateTaskFull(taskId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Не авторизован" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const targetRole = formData.get("targetRole") as string;
    const targetAllUsers = formData.get("targetAllUsers") === "true";
    const branchId = formData.get("branchId") as string;
    const userIdRaw = formData.get("userId") as string;
    const userIds = userIdRaw ? userIdRaw.split(",") : [];
    const points = parseFloat(formData.get("points") as string || "0");

    const deadlineRaw = formData.get("deadline") as string;
    const deadline = deadlineRaw ? new Date(new Date(deadlineRaw).setHours(23, 59, 59, 999)) : null;

    const requirementsRaw = formData.get("requirements") as string;
    const requirements = JSON.parse(requirementsRaw || "[]");

    // Обновляем саму задачу
    await (db as any).task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        priority,
        targetAllUsers,
        targetRole: targetRole || null,
        assignedBranchId: branchId || null,
        assignedUserId: userIds[0] || null,
        points,
        deadline,
        // Пересоздаем требования (удаляем старые, создаем новые)
        requirements: {
          deleteMany: {},
          create: requirements.map((req: any, index: number) => ({
            type: req.type,
            label: req.label,
            isRequired: req.isRequired ?? true,
            order: index,
          }))
        }
      }
    });

    revalidatePath("/admin/tasks");
    return { success: true };
  } catch (error: any) {
    console.error("UPDATE_TASK_ERROR:", error);
    return { error: error.message || "Ошибка сервера" };
  }
}

/**
 * Вспомогательная функция для массового создания задач пользователям
 */
async function createTasksForUsers(baseData: any, userIds: string[], requirements: any[]) {
  for (const uid of userIds) {
    await (db as any).task.create({
      data: {
        ...baseData,
        assignedUserId: uid,
        requirements: {
          create: requirements.map((req: any, index: number) => ({
            type: req.type,
            label: req.label,
            isRequired: req.isRequired ?? true,
            order: index,
          }))
        }
      }
    });
  }
}

// ... existing code ...

export async function getTasksByDate(dateStr: string) {
  const session = await auth();
  if (!session?.user?.id) return [];
  
  const targetDate = new Date(dateStr);
  const start = new Date(targetDate.setHours(0,0,0,0));
  const end = new Date(targetDate.setHours(23,59,59,999));

  return await (db as any).task.findMany({
    where: {
      scheduledAt: { gte: start, lte: end }
    },
    include: {
      assignee: true,
      branch: true,
      completions: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Не авторизован" };
  await (db as any).task.delete({ where: { id } });
  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function updateTaskTitle(id: string, title: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Не авторизован" };
    await (db as any).task.update({ where: { id }, data: { title } });
    revalidatePath("/admin/tasks");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Отправляет отчет о выполнении задачи
 */
export async function submitTaskResponse(formData: FormData) {
  try {
    const taskId = formData.get("taskId") as string;
    console.log("[SUBMIT_TASK] Starting for task:", taskId);

    const session = await auth();
    if (!session?.user?.id) {
      console.warn("[SUBMIT_TASK] Unauthorized attempt");
      return { error: "Не авторизован" };
    }

    const requirementsRaw = formData.get("requirements") as string;
    const requirementsMetadata = JSON.parse(requirementsRaw || "[]");

    // Создаем запись о завершении
    console.log("[SUBMIT_TASK] Creating completion record...");
    const completion = await db.taskCompletion.create({
      data: {
        taskId,
        userId: session.user.id,
      }
    });
    console.log("[SUBMIT_TASK] Completion created ID:", completion.id);

    const uploadDir = path.resolve(process.cwd(), "public/uploads/tasks");
    if (!fs.existsSync(uploadDir)) {
      console.log("[SUBMIT_TASK] Creating uploads directory...");
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Обрабатываем каждый результат требования
    for (const meta of requirementsMetadata) {
      const { id: reqId, value } = meta;
      let imageUrl = null;

      // Проверяем наличие файла для этого требования
      const file = formData.get(`file_${reqId}`) as File | null;
      
      if (file && file.size > 0) {
        console.log(`[SUBMIT_TASK] Handling file upload for requirement ${reqId}`);
        // Сохраняем расширение файла
        const extension = file.name.split('.').pop() || 'jpg';
        const fileName = `resp_${completion.id}_${reqId}_${Date.now()}.${extension}`;
        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/tasks/${fileName}`;
        console.log(`[SUBMIT_TASK] File saved: ${imageUrl}`);
      }

      await db.taskResponse.create({
        data: {
          completionId: completion.id,
          requirementId: reqId,
          value: value || null,
          imageUrl,
        }
      });
      console.log(`[SUBMIT_TASK] Response record created for ${reqId}`);
    }

    await db.task.update({
      where: { id: taskId },
      data: { isCompleted: true }
    });

    console.log("[SUBMIT_TASK] All responses saved successfully. Revalidating...");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error: any) {
    console.error("[SUBMIT_TASK] SEVERE ERROR:", error);
    return { error: `Произошла ошибка при сохранении: ${error.message}` };
  }
}



/**
 * Получает список задач для текущего пользователя (по роли, филиалу или инд.)
 */
export async function getMyTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Перед получением задач проверяем, не пора ли создать новые из шаблонов
  await syncTasksFromTemplates();

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return [];

  return await (db as any).task.findMany({
    where: {
      OR: [
        { targetAllUsers: true },
        { assignedUserId: user.id },
        ...(user.branchId ? [{ assignedBranchId: user.branchId }] : []),
        { targetRole: user.role },
        ...( (user.role === 'EMPLOYEE' || user.role === 'SENIOR_MANAGER') && user.branchId && !user.isOffDay 
             ? [{ targetRole: 'SHIFT_MANAGERS' }] : [] )
      ],
      completions: {
        none: { userId: user.id }
      }
    },
    include: {
      creator: true,
      requirements: { orderBy: { order: 'asc' } },
      completions: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Генерирует задачи на основе шаблонов
 */
export async function syncTasksFromTemplates() {
  const templates = await (db as any).taskTemplate.findMany({
    include: { requirements: true }
  });

  const now = new Date();
  // Всегда работаем с началом дня
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const dayOfWeek = now.getDay() || 7; // 1-7 (Mon-Sun)
  const dayOfMonth = now.getDate();

  for (const template of templates) {
    // Проверяем частоту
    let shouldCreate = false;
    if (template.frequency === 'DAILY') shouldCreate = true;
    else if (template.frequency === 'WEEKLY' && template.dayOfWeek === dayOfWeek) shouldCreate = true;
    else if (template.frequency === 'MONTHLY' && template.dayOfMonth === dayOfMonth) shouldCreate = true;

    if (shouldCreate) {
      // Ищем задачу по шаблону и ДАТЕ (сравниваем именно нормализованный сегодня)
      const existingTask = await (db as any).task.findFirst({
        where: {
          templateId: template.id,
          scheduledAt: todayStart
        }
      });

      if (!existingTask) {
        await (db as any).task.create({
          data: {
            title: template.title,
            description: template.description,
            priority: template.priority,
            creatorId: template.creatorId,
            targetAllUsers: template.targetAllUsers,
            targetRole: template.targetRole,
            assignedBranchId: template.assignedBranchId,
            assignedUserId: template.assignedUserId,
            instructionImageUrl: template.instructionImageUrl,
            points: template.points,
            templateId: template.id,
            scheduledAt: todayStart,
            deadline: new Date(todayStart.getTime() + 23 * 60 * 60 * 1000 + 59 * 60000 + 59 * 1000), // Конец дня (23:59:59)
            requirements: {
              create: template.requirements.map((r: any) => ({
                type: r.type,
                label: r.label,
                isRequired: r.isRequired,
                order: r.order,
              }))
            }
          }
        });
      }
    }
  }
}

/**
 * Получает данные для поиска при постановке задач
 */
export async function getSearchData() {
  const [branches, users] = await Promise.all([
    db.branch.findMany({ select: { id: true, name: true } }),
    db.user.findMany({ select: { id: true, fullName: true, role: true } })
  ]);
  return { branches, users };
}


/**
 * Получает сводку по незавершенным задачам с дедлайном на сегодня
 */
export async function getUnfinishedTasksSummary() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { count: 0, totalPoints: 0 };

    const user = await db.user.findUnique({
      where: { id: session.user.id }
    });
    if (!user) return { count: 0, totalPoints: 0 };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const unfinishedTasks = await (db as any).task.findMany({
      where: {
        OR: [
          { targetAllUsers: true },
          { assignedUserId: user.id },
          ...(user.branchId ? [{ assignedBranchId: user.branchId }] : []),
          { targetRole: user.role },
          ...( (user.role === 'EMPLOYEE' || user.role === 'SENIOR_MANAGER') && user.branchId && !user.isOffDay 
               ? [{ targetRole: 'SHIFT_MANAGERS' }] : [] )
        ],
        completions: {
          none: { userId: user.id }
        },
        deadline: {
          gte: startOfToday,
          lte: endOfToday
        }
      },
      select: {
        points: true
      }
    });

    const count = unfinishedTasks.length;
    const totalPoints = unfinishedTasks.reduce((sum: number, t: any) => sum + (t.points || 0), 0);

    return { count, totalPoints };
  } catch (error) {
    console.error("GET_UNFINISHED_SUMMARY_ERROR:", error);
    return { count: 0, totalPoints: 0 };
  }
}
