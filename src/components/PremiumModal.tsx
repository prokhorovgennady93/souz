"use client";

import { useState } from "react";
import { 
  X, 
  Check, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  ChevronRight,
  Loader2 
} from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 990 }),
      });

      if (response.ok) {
        const { url } = await response.json();
        // Redirect to the confirmation/mock checkout page
        window.location.href = url;
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        {/* Glow decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Zap className="w-6 h-6 text-black fill-current" />
            </div>
            <span className="text-sm font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest">Premium Доступ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Разблокируйте <span className="text-yellow-600 dark:text-yellow-500">полную базу</span> вопросов ДОПОГ
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg leading-relaxed">
            Получите доступ ко всем 1000+ актуальным вопросам, безлимитным экзаменам и глубокой аналитике своих ошибок.
          </p>

          <div className="space-y-4 mb-12">
            <BenefitItem text="Полная актуальная база вопросов 2026" />
            <BenefitItem text="Все категории: Базовый, Цистерны, Класс 1, Класс 7" />
            <BenefitItem text="Симуляция реального экзамена без ограничений" />
            <BenefitItem text="Детальная статистика и разбор типичных ошибок" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-900">
             <div className="flex-1 text-center sm:text-left">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Единоразовый платеж</span>
                <div className="flex items-baseline gap-2 mt-1">
                   <span className="text-4xl font-black">990 ₽</span>
                   <span className="text-zinc-400 line-through text-lg font-medium">1 490 ₽</span>
                </div>
             </div>
             
             <button
               onClick={handleBuy}
               disabled={isLoading}
               className="w-full sm:w-auto bg-zinc-900 dark:bg-yellow-500 hover:bg-zinc-800 dark:hover:bg-yellow-400 text-white dark:text-black font-black py-5 px-10 rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 min-w-[200px]"
             >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Купить сейчас
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
             </button>
          </div>
          
          <p className="text-[10px] text-zinc-400 mt-8 text-center sm:text-left flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            Безопасная оплата через YooKassa. Доступ активируется мгновенно.
          </p>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
        <Check className="w-3 h-3" />
      </div>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{text}</span>
    </div>
  );
}
