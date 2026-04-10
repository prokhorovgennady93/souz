"use client";

import { useState, useEffect } from "react";
import { CloudDownload, CheckCircle2, Loader2, Lock } from "lucide-react";
import { checkTopicDownloaded, downloadTopic } from "@/lib/offline";

interface DownloadCourseButtonProps {
  courseId: string;
  themeIds: string[];
  hasAccess: boolean;
}

export function DownloadCourseButton({ courseId, themeIds, hasAccess }: DownloadCourseButtonProps) {
  const [status, setStatus] = useState<"idle" | "downloading" | "downloaded" | "error" | "locked">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!hasAccess) {
      setStatus("locked");
      return;
    }
    
    // Check if ALL themes are downloaded
    const checkAllThemes = async () => {
      let allDownloaded = true;
      for (const tId of themeIds) {
         const isDownloaded = await checkTopicDownloaded(tId);
         if (!isDownloaded) {
            allDownloaded = false;
            break;
         }
      }
      
      if (themeIds.length > 0 && allDownloaded) setStatus("downloaded");
      else setStatus("idle");
    };
    checkAllThemes();
  }, [themeIds, hasAccess]);

  const handleDownloadAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasAccess) {
      alert("Офлайн-режим доступен только в Premium-версии.");
      return;
    }

    if (status === "downloaded" || status === "downloading") return;

    setStatus("downloading");
    setProgress(0);

    try {
      let downloadedCount = 0;
      for (const tId of themeIds) {
        // Download sequentially to avoid aggressive rate limits/memory explosions on low end devices
        await downloadTopic(tId, courseId, () => {});
        downloadedCount++;
        setProgress(Math.round((downloadedCount / themeIds.length) * 100));
      }
      setStatus("downloaded");
      
      // Notify all Topic Buttons to synchronize their status
      window.dispatchEvent(new CustomEvent('offline-status-changed', {
        detail: { courseId, themeIds }
      }));
    } catch (error) {
      console.error("Course download failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleDownloadAll}
      disabled={status === "downloading"}
      className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-3 border ${
        status === "downloaded"
          ? "bg-green-500/10 border-green-500/20 text-green-600 cursor-default"
          : status === "downloading"
          ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
          : status === "locked"
          ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-60"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-yellow-500 hover:text-yellow-600 shadow-xl"
      }`}
      title={status === "locked" ? "Доступно в Premium" : (status === "downloaded" ? "Весь курс доступен офлайн" : "Скачать весь курс для работы без интернета")}
    >
      {status === "downloading" ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Скачивание: {progress}%</span>
        </>
      ) : status === "downloaded" ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>Курс сохранен офлайн</span>
        </>
      ) : status === "locked" ? (
        <>
          <Lock className="w-5 h-5" />
          <span>Скачать курс (Premium)</span>
        </>
      ) : (
        <>
          <CloudDownload className="w-5 h-5" />
          <span>Скачать весь курс</span>
        </>
      )}
    </button>
  );
}
