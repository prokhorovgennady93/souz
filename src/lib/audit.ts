import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Логирует сообщения от FFmpeg в файл для отладки
 */
function debugLog(message: string) {
  const logPath = path.resolve(process.cwd(), "public/ffmpeg_debug.log");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

/**
 * Получает IP адрес клиента из заголовков Next.js
 */
export async function getClientIp() {
  try {
    const forwardedFor = (await headers()).get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
  } catch (e) {
    // In standalone scripts headers() might fail
  }
  return "127.0.0.1";
}

/**
 * Запускает процесс аудита: захват 3-х кадров и сверка IP
 */
export async function conductShiftAudit(shiftId: string, actionType: string) {
  try {
    const shift = await db.shift.findUnique({
      where: { id: shiftId },
      include: { branch: true }
    });

    if (!shift || !shift.branch.rtspUrl) {
      debugLog(`Audit skipped: No shift found or no RTSP URL for branch ${shift?.branchId}`);
      return;
    }

    const rtspUrl = shift.branch.rtspUrl;
    const expectedIp = shift.branch.expectedIp;
    const clientIp = await getClientIp();
    const isMatch = expectedIp ? clientIp === expectedIp : true;

    // Создаем запись аудита (уникальную)
    const audit = await db.shiftAudit.create({
      data: {
        shiftId,
        actionType,
        clientIp,
        isMatch,
      }
    });

    debugLog(`--- Starting Audit ${audit.id} for shift ${shiftId} (${actionType}) ---`);

    // Все кадры (0, 5 и 10 сек) запускаем в фоне, чтобы не блокировать UI
    (async () => {
      debugLog(`[AUDIT BG] Starting async capture sequence for audit ${audit.id}`);
      await captureSingleSnapshot(audit.id, rtspUrl, 0); // 0 сек
      await captureSingleSnapshot(audit.id, rtspUrl, 1); // 5 сек
      await captureSingleSnapshot(audit.id, rtspUrl, 2); // 10 сек
      debugLog(`--- Audit ${audit.id} Finished ---`);
    })();

    return audit;
  } catch (error) {
    debugLog(`CRITICAL AUDIT ERROR: ${String(error)}`);
  }
}

/**
 * Захватывает ОДИН кадр через прямой вызов spawn (ffmpeg.exe)
 */
async function captureSingleSnapshot(auditId: string, rtspUrl: string, index: number) {
  const intervals = [0, 5, 10];
  const delay = intervals[index];
  const publicDir = path.resolve(process.cwd(), "public/uploads/audits");
  
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const fileName = `audit_${auditId}_${index + 1}.jpg`;
  const filePath = path.join(publicDir, fileName);
  const dbField = `imageUrl${index + 1}`;

  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
  }

  // Dinamically find the ffmpeg binary using ffmpeg-static package
  let ffmpegPath: string | null = null;
  try {
    // Try to use the package
    const ffmpegStatic = require('ffmpeg-static');
    ffmpegPath = typeof ffmpegStatic === 'string' ? ffmpegStatic : ffmpegStatic.path;
  } catch (e) {
    debugLog(`Warning: could not require ffmpeg-static: ${String(e)}`);
  }

  // Fallback for standalone build or if package resolution fails
  if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
    const possiblePaths = [
      path.resolve(process.cwd(), "node_modules/ffmpeg-static/ffmpeg"),
      path.resolve(process.cwd(), "node_modules/ffmpeg-static/ffmpeg.exe"),
      "/usr/bin/ffmpeg", // Common Linux path
      "ffmpeg" // Hope it is in PATH
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        ffmpegPath = p;
        break;
      }
    }
  }

  if (!ffmpegPath) {
    debugLog(`CRITICAL ERROR: FFmpeg binary NOT found in any known locations.`);
    return;
  }

  return new Promise((resolve) => {
    debugLog(`[CAPTURE ${index + 1}] Executing: ${ffmpegPath}`);
    debugLog(`[CAPTURE ${index + 1}] Target: ${fileName}`);
    
    const ffmpegProcess = spawn(ffmpegPath, [
      "-y",
      "-rtsp_transport", "tcp",
      "-stimeout", "5000000", // 5 секунд таймаут соединения (в микросекундах)
      "-analyzeduration", "1000000",
      "-probesize", "1000000",
      "-i", rtspUrl,
      "-frames:v", "1",
      "-update", "1",
      filePath
    ], { shell: false });

    let fullOutput = "";

    ffmpegProcess.stdout.on("data", (data) => {
      const msg = data.toString();
      fullOutput += msg;
      debugLog(`[FFMPEG STDOUT ${index + 1}]: ${msg.trim()}`);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      const msg = data.toString();
      fullOutput += msg;
      debugLog(`[FFMPEG STDERR ${index + 1}]: ${msg.trim()}`);
    });

    ffmpegProcess.on("close", async (code) => {
      if (code === 0 && fs.existsSync(filePath)) {
        debugLog(`[SUCCESS ${index + 1}] Saved to: ${fileName}`);
        
        await db.shiftAudit.update({
          where: { id: auditId },
          data: { [dbField]: `/uploads/audits/${fileName}` }
        });
        
        revalidatePath("/admin/monitoring");
        resolve(true);
      } else {
        debugLog(`[FAILURE ${index + 1}] Code ${code}. Final Output: ${fullOutput.slice(-300)}`);
        resolve(false);
      }
    });

    // Тайм-аут 30 сек (для медленных камер)
    setTimeout(() => {
      try {
        if (ffmpegProcess.exitCode === null) {
          ffmpegProcess.kill("SIGKILL");
          debugLog(`[TIMEOUT ${index + 1}] Killed after 30s. Last Output: ${fullOutput.slice(-300)}`);
        }
        resolve(false);
      } catch (e) {}
    }, 30000);
  });
}

