"use client";

import { Target, AlertCircle, CheckCircle2 } from "lucide-react";

interface TopicMastery {
  id: string;
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  mastery: number; // 0-100
}

interface DashboardChartsProps {
  topicMastery: TopicMastery[];
}

export function MasteryHeatmap({ topicMastery }: DashboardChartsProps) {
  if (topicMastery.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black mb-1">Мастерство по темам</h3>
          <p className="text-sm text-zinc-500 font-medium">Ваш прогресс в изучении материалов ДОПОГ</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-400">
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800"></div> 0%</div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> 100%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicMastery.map((topic) => (
          <div key={topic.id} className="group relative">
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[80%]">{topic.title}</h4>
              <span className={`text-xs font-black ${topic.mastery >= 80 ? 'text-green-600' : topic.mastery >= 40 ? 'text-orange-600' : 'text-zinc-400'}`}>
                {topic.mastery}%
              </span>
            </div>
            
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  topic.mastery >= 80 ? 'bg-green-500' : 
                  topic.mastery >= 40 ? 'bg-orange-500' : 
                  'bg-zinc-300 dark:bg-zinc-700'
                }`}
                style={{ width: `${topic.mastery}%` }}
              />
            </div>
            
            <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
               <span>{topic.correctAnswers} / {topic.totalQuestions} Вопросов</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeakestThemeCard({ theme }: { theme: TopicMastery | null }) {
  if (!theme || theme.mastery >= 90) return null;

  return (
    <div className="bg-orange-500 text-white rounded-[32px] p-8 shadow-xl shadow-orange-900/10 flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
         <AlertCircle className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Нужна практика</span>
        <h3 className="text-2xl font-black mb-2 leading-tight">Слабая тема:</h3>
        <p className="text-lg font-bold opacity-90 truncate mb-4">{theme.title}</p>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
           <span className="text-4xl font-black">{theme.mastery}%</span>
           <span className="text-sm font-bold opacity-70">точность ответов</span>
        </div>
        <button className="w-full bg-white text-orange-600 font-black py-4 rounded-2xl hover:bg-zinc-100 transition-all shadow-lg active:scale-95">
           Подтянуть знания
        </button>
      </div>
    </div>
  );
}

export function OverallMasteryGauge({ mastery }: { mastery: number }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
      <div className="relative w-32 h-32 mb-6">
        {/* Simple SVG gauge */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-zinc-100 dark:text-zinc-800"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={364.4}
            strokeDashoffset={364.4 - (364.4 * mastery) / 100}
            strokeLinecap="round"
            className="text-orange-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black">{mastery}%</span>
        </div>
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-1">Общий прогресс</h3>
      <p className="text-xs font-bold text-zinc-500 leading-relaxed">Курс пройден на {mastery}% от общего пула вопросов.</p>
    </div>
  );
}
