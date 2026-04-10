"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, User, MapPin, Camera, ClipboardCheck, AlertTriangle, Download, Paperclip } from "lucide-react";

export default function TaskControlGallery({ 
  items, 
  initialIndex, 
  onClose 
}: { 
  items: any[], 
  initialIndex: number, 
  onClose: () => void 
}) {
  const [index, setIndex] = useState(initialIndex);
  
  const current = items[index];
  if (!current) return null;

  // Извлекаем все медиа-ответы
  const responses = current.completion?.responses.filter((r: any) => r.imageUrl) || [];
  const primaryResponse = responses[0];
  const fileUrl = primaryResponse?.imageUrl;
  const isImage = fileUrl && (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.webp'));
  
  const handlePrev = () => setIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setIndex(prev => Math.min(items.length - 1, prev + 1));

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 sm:p-10 transition-all font-sans" onClick={onClose}>
      <button className="absolute top-6 right-6 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/10 active:scale-95" title="Закрыть">
        <X className="w-8 h-8"/>
      </button>

      <div className="max-w-6xl w-full h-full relative flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
        
        {/* Navigation Arrows */}
        <button 
          disabled={index === 0}
          onClick={handlePrev}
          className="absolute left-[-20px] sm:left-[-70px] p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all disabled:opacity-10 border border-white/10 z-10 active:scale-90"
        >
          <ChevronLeft className="w-8 h-8"/>
        </button>
        
        <button 
          disabled={index === items.length - 1}
          onClick={handleNext}
          className="absolute right-[-20px] sm:right-[-70px] p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all disabled:opacity-10 border border-white/10 z-10 active:scale-90"
        >
          <ChevronRight className="w-8 h-8"/>
        </button>

        {/* Content Viewer */}
        <div className="relative w-full aspect-[16/9] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 flex items-center justify-center">
            
            {current.status === 'COMPLETED' ? (
              fileUrl ? (
                isImage ? (
                  <img 
                    key={fileUrl} 
                    src={fileUrl} 
                    alt="Task report" 
                    className="w-full h-full object-contain animate-in fade-in duration-500" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 text-center animate-in zoom-in-95 duration-300">
                     <div className="w-32 h-32 bg-brand-blue/10 text-brand-blue rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-brand-blue/20">
                        <Paperclip className="w-16 h-16" />
                     </div>
                     <h2 className="text-3xl font-black text-white px-8 py-4 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                        Документ прикреплен
                     </h2>
                     <a 
                       href={fileUrl} 
                       download 
                       target="_blank"
                       className="mt-8 px-10 py-5 bg-brand-blue hover:bg-brand-blue/80 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-3 transition-all scale-110 shadow-2xl shadow-brand-blue/40"
                     >
                        <Download className="w-6 h-6" /> Скачать файл
                     </a>
                  </div>
                )
              ) : (
                // Заглушка ВЫПОЛНЕНО без фото
                <div className="flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
                   <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <ClipboardCheck className="w-12 h-12" />
                   </div>
                   <h2 className="text-4xl font-black text-white italic tracking-widest uppercase">ВЫПОЛНЕНО</h2>
                   <p className="text-zinc-500 mt-4 text-xs font-bold uppercase tracking-widest">Фото-подтверждение не требовалось</p>
                </div>
              )
            ) : (
              // Заглушка НЕ ВЫПОЛНЕНО
              <div className="flex flex-col items-center justify-center p-10 text-center animate-in zoom-in-95 duration-300">
                 <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <AlertTriangle className="w-12 h-12" />
                 </div>
                 <h2 className="text-6xl font-black text-red-500 italic tracking-[0.2em] uppercase">НЕ ВЫПОЛНЕНО</h2>
                 <p className="text-zinc-500 mt-6 text-sm font-bold uppercase tracking-widest opacity-50">Сотрудник еще не приступил к заданию</p>
              </div>
            )}

            {/* Overlays Header */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-start">
               <div className="px-4 py-2 bg-black/60 text-white/90 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Сотрудник</p>
                    <p className="text-xs font-black">{current.user.fullName}</p>
                  </div>
               </div>

               <div className="px-4 py-2 bg-black/60 text-white/90 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Филиал</p>
                    <p className="text-xs font-black uppercase">{current.user.branchName}</p>
                  </div>
               </div>
            </div>

            {/* Response Text Footer */}
            {current.status === 'COMPLETED' && (
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <div className="shrink-0 p-2 bg-brand-blue/20 rounded-lg">
                       <Camera className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Ответ сотрудника:</p>
                       <div className="text-sm text-white/90 font-medium leading-relaxed italic">
                         {current.completion?.responses.map((r: any) => r.value).filter(Boolean).join(" | ") || "Безо текстового ответа"}
                       </div>
                    </div>
                 </div>
              </div>
            )}
        </div>

        {/* Thumbnails list or indicators */}
        <div className="absolute bottom-[-60px] max-w-full flex items-center gap-2 overflow-x-auto px-10 scrollbar-hide py-2">
           {items.map((item, i) => (
             <button 
               key={i} 
               onClick={() => setIndex(i)}
               className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                 i === index 
                    ? 'scale-110 border-white bg-white/10' 
                    : (item.status === 'COMPLETED' ? 'border-green-500/30' : 'border-red-500/30')
               }`}
             >
                <div className={`w-2 h-2 rounded-full ${item.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'}`} />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
