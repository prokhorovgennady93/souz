import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: Request) {
  // Этот маршрут предназначен для вызова извне (Cron-сервиса Vercel или локального скрипта)
  // Вызывается каждую ночь в 00:01

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "cron_secret_k3j4"}`) {
    // В dev среде позволим вызов без токена, в продакшене - нет
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Находим все смены, которые не были закрыты
    const unclosedShifts = await db.shift.findMany({
      where: {
        closedAt: null,
      }
    });

    let closedCount = 0;
    const now = new Date();

    for (const shift of unclosedShifts) {
      // Можно усложнить логику (проверять дату), но если смена открыта и наступило 00:01 - закрываем
      await db.shift.update({
        where: { id: shift.id },
        data: {
          closedAt: now,
          autoClosed: true, // Помечаем, что закрыто системой
        }
      });
      closedCount++;
    }

    // Также принудительно завершаем все забытые перерывы
    await db.shiftBreak.updateMany({
      where: { endedAt: null },
      data: { endedAt: now }
    });

    // --- Cleanup 60 Days Retention ---
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const oldAudits = await db.shiftAudit.findMany({
      where: { timestamp: { lt: sixtyDaysAgo } }
    });

    for (const audit of oldAudits) {
      // Удаляем физические файлы
      [audit.imageUrl1, audit.imageUrl2, audit.imageUrl3].forEach(img => {
        if (img) {
          const filePath = path.join(process.cwd(), "public", img);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      });
    }

    await db.shiftAudit.deleteMany({
      where: { timestamp: { lt: sixtyDaysAgo } }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Cron job executed: auto-closed ${closedCount} orphaned shift(s). Cleaned up ${oldAudits.length} old audits.` 
    });
  } catch (error) {
    console.error("Cron Error: ", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
