"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CloudDownload, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { checkTopicDownloaded, downloadCourse } from "@/lib/offline";

interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  questionCount: number;
  hasAccess?: boolean;
  themes?: { id: string }[];
}

export function CourseCard({ id, slug, title, description, icon, questionCount, hasAccess = false, themes = [] }: CourseCardProps) {
  const [status, setStatus] = useState<"idle" | "downloading" | "downloaded" | "locked">("idle");
  const [progress, setProgress] = useState(0);
  const themeIds = themes.map(t => t.id);

  useEffect(() => {
    if (!hasAccess) {
      setStatus("locked");
      return;
    }
    
    const checkAllDownloaded = async () => {
      if (themeIds.length === 0) return;
      const results = await Promise.all(themeIds.map(checkTopicDownloaded));
      const allDone = results.every(res => res === true);
      if (allDone) setStatus("downloaded");
      else setStatus("idle");
    };
    
    checkAllDownloaded();
  }, [themeIds.length, hasAccess]);

  const handleDownloadAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasAccess) {
      alert("Полное скачивание курса доступно только пользователям с Premium подпиской. Пожалуйста, приобретите доступ для работы офлайн.");
      return;
    }

    if (status === "downloaded" || status === "downloading") return;

    setStatus("downloading");
    setProgress(0);

    try {
      await downloadCourse(id, slug, themeIds, (topicId, p) => {
        // Find index of current topic to show overall progress
        const idx = themeIds.indexOf(topicId);
        const totalProgress = Math.round(((idx + (p/100)) / themeIds.length) * 100);
        setProgress(totalProgress);
      });
      setStatus("downloaded");
    } catch (error) {
      console.error("Course download failed:", error);
      setStatus("idle");
      alert("Произошла ошибка при скачивании. Пожалуйста, проверьте интернет-соединение.");
    }
  };

  return (
    <Link
      href={`/course/${slug}`}
      className="group relative flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          {icon || "📦"}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAll}
            disabled={status === "downloading"}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[9px] font-black uppercase tracking-wider ${
              status === "downloaded"
                ? "bg-green-500/10 border-green-500/20 text-green-600 cursor-default"
                : status === "downloading"
                ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
                : status === "locked"
                ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-orange-500 hover:text-orange-600 shadow-sm"
            }`}
          >
            {status === "downloading" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{progress}%</span>
              </>
            ) : status === "downloaded" ? (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>Скачано</span>
              </>
            ) : status === "locked" ? (
              <>
                <CloudDownload className="w-3 h-3" />
                <span className="opacity-50">Premium</span>
              </>
            ) : (
              <>
                <CloudDownload className="w-3 h-3" />
                <span>Скачать</span>
              </>
            )}
          </button>

          <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            {questionCount}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">
        {description || "Полный курс подготовки по данной категории ДОПОГ."}
      </p>

      <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white group/btn mt-auto">
        Перейти к курсу
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </div>
    </Link>
  );
}
