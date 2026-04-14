"use client";

import { useEffect, useState } from "react";
import { getFfmpegLogs, clearFfmpegLogs } from "@/app/actions/logs";
import { RefreshCw, Trash2, ShieldAlert } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<string>("Загрузка логов...");
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await getFfmpegLogs();
    if (res.error) {
      setLogs(`Ошибка: ${res.error}`);
    } else {
      setLogs(res.logs || "Логов пока нет.");
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (!confirm("Вы действительно хотите очистить лог-файл?")) return;
    setLoading(true);
    const res = await clearFfmpegLogs();
    if (res.error) alert(res.error);
    else setLogs("Логи очищены.");
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-brand-blue" />
            Логи FFmpeg (Камеры)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Техническая информация о попытках захвата кадров с камер филиалов.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </button>
          <button 
            onClick={handleClear}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Очистить
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue/50 to-transparent"></div>
        <pre className="font-mono text-[13px] text-zinc-300 overflow-auto max-h-[70vh] whitespace-pre-wrap scrollbar-thin scrollbar-thumb-zinc-800">
          {logs}
        </pre>
      </div>

      <div className="text-xs text-zinc-500 italic">
        * Лог показывает последние 1000 строк из файла public/ffmpeg_debug.log
      </div>
    </div>
  );
}
