"use client";

import { Award, Star, Flame, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export function AchievementGrid({ achievements }: AchievementsProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-xl font-black mb-1">Достижения</h3>
        <p className="text-sm text-zinc-500 font-medium">Ваши награды и успехи в обучении</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`p-6 rounded-[24px] border-2 transition-all ${
              achievement.isUnlocked 
              ? 'bg-zinc-950 dark:bg-zinc-800 border-zinc-900 text-white shadow-xl shadow-zinc-900/10 scale-[1.02]' 
              : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 text-zinc-400 opacity-60'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
               achievement.isUnlocked ? 'bg-orange-600 text-white shadow-[0_0_24px_rgba(234,88,12,0.4)]' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
            }`}>
               {achievement.icon}
            </div>
            
            <h4 className="text-sm font-black mb-2 tracking-tight line-clamp-1">{achievement.title}</h4>
            <p className="text-[10px] font-bold leading-relaxed opacity-60">{achievement.description}</p>
            
            {achievement.isUnlocked && achievement.unlockedAt && (
               <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Получено</span>
                  <span className="text-[8px] font-black">{new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}</span>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DailyStreakCard({ streak }: { streak: number }) {
  return (
    <div className="bg-zinc-950 text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
         <Flame className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <span className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-4 inline-block">Daily Streak</span>
        <h3 className="text-2xl font-black mb-6 leading-tight">Ударный режим: <br /> {streak} дня</h3>
        
        <div className="flex gap-2">
           {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                   i < streak ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/20'
                }`}
              >
                 <Flame className="w-4 h-4" />
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
