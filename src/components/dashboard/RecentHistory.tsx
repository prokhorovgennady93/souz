"use client";

import { Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Attempt {
  id: string;
  courseTitle: string;
  score: number;
  isPassed: boolean;
  timeTaken: number | null;
  startedAt: Date;
}

interface RecentHistoryProps {
  attempts: Attempt[];
}

export function RecentHistory({ attempts }: RecentHistoryProps) {
  if (attempts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black mb-1">История экзаменов</h3>
          <p className="text-sm text-zinc-500 font-medium">Ваши последние результаты</p>
        </div>
        <Link href="/dashboard/history" className="text-sm font-black text-orange-600 hover:translate-x-1 transition-transform flex items-center gap-2">
           Вся история <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-transparent hover:border-orange-500/20 transition-all group">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${attempt.isPassed ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-red-100 text-red-600 dark:bg-red-500/10'}`}>
                {attempt.isPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{attempt.courseTitle}</h4>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {attempt.timeTaken ? `${Math.floor(attempt.timeTaken / 60)} мин ${attempt.timeTaken % 60} сек` : '—'}</span>
                  <span>{new Date(attempt.startedAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className={`text-xl font-black ${attempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {attempt.score} / 25
                </span>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Результат</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-orange-600 group-hover:bg-orange-50 transition-all">
                 <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
