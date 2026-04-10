"use client";

import { useState, useEffect, useCallback } from "react";
import { CloudDownload, CheckCircle2, Loader2, Lock } from "lucide-react";
import { checkTopicDownloaded, downloadTopic } from "@/lib/offline";

interface DownloadTopicButtonProps {
  topicId: string;
  topicTitle: string;
  courseId: string;
  hasAccess: boolean;
}

export function DownloadTopicButton({ topicId, topicTitle, courseId, hasAccess }: DownloadTopicButtonProps) {
  const [status, setStatus] = useState<"idle" | "downloading" | "downloaded" | "error" | "locked">("idle");
  const [progress, setProgress] = useState(0);

    const checkStatus = useCallback(async () => {
      const isDownloaded = await checkTopicDownloaded(topicId);
      if (isDownloaded) setStatus("downloaded");
      else setStatus("idle");
    }, [topicId]);

    useEffect(() => {
      if (!hasAccess) {
        setStatus("locked");
        return;
      }
      checkStatus();
    }, [hasAccess, checkStatus]);

    // Handle global offline status updates
    useEffect(() => {
      const handleGlobalUpdate = () => {
        checkStatus();
      };
      window.addEventListener('offline-status-changed', handleGlobalUpdate);
      return () => window.removeEventListener('offline-status-changed', handleGlobalUpdate);
    }, [checkStatus]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasAccess) {
      alert("Функция скачивания доступна только в Premium-версии.");
      return;
    }

    if (status === "downloaded" || status === "downloading") return;

    setStatus("downloading");
    setProgress(0);

    try {
      await downloadTopic(topicId, courseId, (p) => {
        setProgress(p);
      });
      setStatus("downloaded");
      
      // Notify other components (like the course download button) to refresh their status
      window.dispatchEvent(new CustomEvent('offline-status-changed', {
        detail: { topicId, courseId }
      }));
    } catch (error) {
      console.error("Download failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === "downloading"}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest ${
        status === "downloaded"
          ? "bg-green-500/10 border-green-500/20 text-green-600 cursor-default"
          : status === "downloading"
          ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
          : status === "locked"
          ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300 opacity-60"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-orange-500 hover:text-orange-600 active:scale-95 shadow-sm"
      }`}
      title={status === "locked" ? "Доступно в Premium" : (status === "downloaded" ? "Доступно офлайн" : "Скачать для работы без интернета")}
    >
      {status === "downloading" ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{progress}%</span>
        </>
      ) : status === "downloaded" ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Скачано</span>
        </>
      ) : status === "locked" ? (
        <>
          <Lock className="w-3.5 h-3.5" />
          <span>Premium</span>
        </>
      ) : (
        <>
          <CloudDownload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Офлайн</span>
        </>
      )}
    </button>
  );
}
