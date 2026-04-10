"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Timer, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Settings2,
  Flag,
  HelpCircle
} from "lucide-react";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  topic: string;
  imageUrl: string | null;
  options: Option[];
}

interface ExamSimulationProps {
  courseId: string;
  courseTitle: string;
  questions: Question[];
  timeLimitMinutes: number;
}

export function ExamSimulation({ 
  courseId, 
  courseTitle, 
  questions, 
  timeLimitMinutes 
}: ExamSimulationProps) {
  const router = useRouter();
  
  // Settings
  const [autoTransition, setAutoTransition] = useState(false);
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isFinished) {
        if (timeLeft <= 0) handleFinish();
        return;
    };

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleOptionSelect = (optionId: string) => {
    if (isFinished) return;
    setSelectedOptionId(optionId);
    
    if (autoTransition) {
      confirmAnswer(optionId);
    }
  };

  const confirmAnswer = (optionId?: string) => {
    const finalOptionId = optionId || selectedOptionId;
    if (!finalOptionId) return;

    const newAnswers = { ...answers, [questions[currentIndex].id]: finalOptionId };
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers = answers) => {
    setIsFinished(true);
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          answers: finalAnswers,
          timeTaken: (timeLimitMinutes * 60) - timeLeft,
        }),
      });

      if (response.ok) {
        const { attemptId } = await response.json();
        router.push(`/exam/results/${attemptId}`);
      }
    } catch (error) {
      console.error("Failed to submit exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  if (isSubmitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Обработка результатов...</h2>
        <p className="text-zinc-500">Пожалуйста, подождите, мы подсчитываем ваши баллы.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Top Navigation / Info */}
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 py-2 flex flex-col gap-2">
          {/* Row 1: Timer and Finish */}
          <div className="flex items-center justify-between h-10 w-full">
             <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold ${timeLeft < 300 ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'}`}>
                   <Timer className="w-4 h-4" />
                   {formatTime(timeLeft)}
                </div>
                <h1 className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter hidden sm:block truncate max-w-[150px]">{courseTitle}</h1>
             </div>

             <button 
               onClick={() => handleFinish()}
               className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
             >
               Завершить экзамен
               <Flag className="w-3.5 h-3.5 text-yellow-500 fill-current" />
             </button>
          </div>

          {/* Row 2: Toggles and Help */}
          <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-zinc-50 dark:border-zinc-800 pt-2">
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button 
                  onClick={() => setAutoTransition(false)}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${!autoTransition ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  Подтверждение
                </button>
                <button 
                  onClick={() => setAutoTransition(true)}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${autoTransition ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  Автопереход
                </button>
            </div>
            
            <div className="relative">
               <button 
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="focus:outline-none flex items-center justify-center p-1"
                aria-label="Показать справку"
               >
                 <HelpCircle className={`w-5 h-5 transition-colors cursor-help ${isHelpOpen ? 'text-yellow-500' : 'text-zinc-400 hover:text-yellow-500'}`} />
               </button>
               {isHelpOpen && (
                 <>
                   <div 
                    className="fixed inset-0 z-40 sm:hidden" 
                    onClick={() => setIsHelpOpen(false)} 
                   />
                   <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-zinc-900 dark:bg-zinc-800 text-white text-[11px] rounded-xl shadow-2xl z-50 border border-zinc-800 animate-in fade-in zoom-in duration-200">
                      <p className="font-bold mb-1 text-yellow-500">Режимы ответов:</p>
                      <p className="text-zinc-400 leading-relaxed font-medium">
                        <span className="text-white">Подтверждение</span> — вы выбираете вариант и нажимаете кнопку для перехода к следующему вопросу.<br/><br/>
                        <span className="text-white">Автопереход</span> — следующий вопрос появится автоматически сразу после выбора варианта.
                      </p>
                   </div>
                 </>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
           {/* Question Card */}
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded">
                  {currentQuestion.topic}
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  Вопрос {currentIndex + 1} из {questions.length}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold leading-relaxed mb-8">
                {currentQuestion.text}
              </h2>

              {currentQuestion.imageUrl && !imageErrors[currentIndex] && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-center">
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Question view" 
                    className="max-h-64 object-contain" 
                    onError={() => setImageErrors(prev => ({ ...prev, [currentIndex]: true }))}
                  />
                </div>
              )}

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group active:scale-[0.99] ${selectedOptionId === option.id ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-500/5 ring-4 ring-yellow-500/5' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedOptionId === option.id ? 'bg-yellow-500 border-yellow-500' : 'border-zinc-300 dark:border-zinc-700 group-hover:border-yellow-500'}`}>
                        {selectedOptionId === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-base font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
           </div>

           {/* Next Action (if not auto-transition) */}
           {!autoTransition && (
             <button
               disabled={!selectedOptionId}
               onClick={() => confirmAnswer()}
               className={`w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${selectedOptionId ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/10 hover:-translate-y-1' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
             >
               Подтвердить и продолжить
               <ChevronRight className="w-6 h-6" />
             </button>
           )}

           <div className="flex items-center gap-2 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
             <AlertCircle className="w-5 h-5 text-zinc-400" />
             <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
               Внимательно проверьте свой выбор. После подтверждения вернуться к этому вопросу будет невозможно.
             </p>
           </div>
        </div>

        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Навигация</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                  <div 
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold border ${i === currentIndex ? 'border-yellow-500 bg-yellow-500 text-black' : (answers[questions[i].id] ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-700 dark:border-zinc-700' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400')}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
           </div>
        </aside>
      </main>
    </div>
  );
}
