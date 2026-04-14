"use server"

import fs from "fs";
import path from "path";
import { auth } from "../../../auth";

const LOG_FILE = path.resolve(process.cwd(), "public/ffmpeg_debug.log");

export async function getFfmpegLogs() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Недостаточно прав" };

  try {
    if (!fs.existsSync(LOG_FILE)) {
      return { logs: "Лог-файл еще не создан." };
    }

    const content = fs.readFileSync(LOG_FILE, "utf-8");
    // Возвращаем последние 1000 строк
    const lines = content.split("\n");
    const lastLines = lines.slice(-1000).join("\n");
    
    return { logs: lastLines };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function clearFfmpegLogs() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Недостаточно прав" };

  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, "");
    }
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}
