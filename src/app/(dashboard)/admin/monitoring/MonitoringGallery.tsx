"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Camera, MapPin, ShieldCheck, ShieldAlert, Clock, User, X, ChevronLeft, ChevronRight, Maximize2, Trash2 } from "lucide-react";
import { deleteAudit } from "@/app/actions/audit";

export default function MonitoringGallery({ audits }: { audits: any[] }) {
  const [modalData, setModalData] = useState<{ images: (string | null)[], index: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getActionLabel = (type: string, timestamp: Date) => {
    switch (type) {
      case "START": return "Открытие филиала";
      case "BREAK_END": return `Возврат с перерыва (${format(new Date(timestamp), "HH:mm")})`;
      default: return "Событие";
    }
  };

  const openLightbox = (images: (string | null)[], startIndex: number) => {
    setModalData({ images, index: startIndex });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Вы уверены, что хотите удалить это событие и все привязанные фото?")) return;
    
    setDeletingId(id);
    const res = await deleteAudit(id);
    
    if (res.error) {
      alert(res.error);
      setDeletingId(null);
    }
    // No need to reset deletingId on success as the element will be unmounted by revalidatePath
  };


  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
      {audits.map(audit => {
        const images = [audit.imageUrl1, audit.imageUrl2, audit.imageUrl3];
        
        return (
          <div key={audit.id} className={`bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all group/card ${deletingId === audit.id ? 'opacity-30 scale-95 pointer-events-none' : ''}`}>
            
            {/* Header Info */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow transition-colors">
                   <User className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{audit.shift.user.fullName}</h3>
                   <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 font-medium font-sans">
                      <span className="flex items-center gap-1 opacity-80"><Clock className="w-3.5 h-3.5" /> {format(new Date(audit.timestamp), "HH:mm:ss", { locale: ru })}</span>
                      <span className="flex items-center gap-1 opacity-80"><MapPin className="w-3.5 h-3.5" /> {audit.shift.branch.name}</span>
                   </div>
                 </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${audit.actionType === "START" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                  {getActionLabel(audit.actionType, audit.timestamp)}
                </div>
                
                <div className={`flex items-center justify-end gap-1.5 mt-2 text-[10px] font-bold ${audit.isMatch ? 'text-blue-600' : 'text-red-500'}`}>
                  {audit.isMatch ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  <span>{audit.clientIp} {audit.isMatch ? '(Корректный IP)' : '(IP НЕ СОВПАЛ)'}</span>
                </div>
              </div>

              <div className="ml-4">
                 <button 
                   onClick={(e) => handleDelete(e, audit.id)}
                   className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-500/80 dark:hover:text-white rounded-2xl transition-all active:scale-90"
                   title="Удалить навсегда"
                   disabled={deletingId === audit.id}
                 >
                   <Trash2 className={`w-5 h-5 ${deletingId === audit.id ? 'animate-pulse' : ''}`} />
                 </button>
              </div>
            </div>

            {/* Snapshots Gallery */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} 
                  onClick={() => img && openLightbox(images, idx)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-brand-blue/50 dark:hover:border-brand-yellow/50 group/img shadow-sm ${img ? 'cursor-pointer active:scale-95' : ''}`}
                >
                  {img ? (
                     <>
                       <img src={img} alt={`Snapshot ${idx + 1}`} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white w-6 h-6 transform scale-75 group-hover/img:scale-100 transition-transform" />
                       </div>
                     </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 opacity-50 relative">
                      <Camera className="w-6 h-6 mb-1 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Ожидание...</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded-md backdrop-blur-sm border border-white/10">
                    {idx * 5} сек
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* --- LIGHTBOX MODAL WITH CAROUSEL --- */}
      {modalData && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 sm:p-10 transition-all group/modal" onClick={() => setModalData(null)}>
          <button className="absolute top-6 right-6 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/10 active:scale-95" title="Закрыть">
            <X className="w-8 h-8"/>
          </button>
          
          <div className="max-w-6xl w-full max-h-[90vh] relative flex items-center justify-center" onClick={e => e.stopPropagation()}>
            
            {/* Arrows */}
            <button 
              disabled={modalData.index === 0}
              onClick={() => setModalData(prev => prev ? ({ ...prev, index: prev.index - 1 }) : null)}
              className="absolute left-[-20px] sm:left-[-70px] p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all disabled:opacity-20 border border-white/10 z-10 active:scale-90"
            >
              <ChevronLeft className="w-8 h-8"/>
            </button>
            
            <button 
              disabled={modalData.index === modalData.images.length - 1 || !modalData.images[modalData.index + 1]}
              onClick={() => setModalData(prev => prev ? ({ ...prev, index: prev.index + 1 }) : null)}
              className="absolute right-[-20px] sm:right-[-70px] p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all disabled:opacity-20 border border-white/10 z-10 active:scale-90"
            >
              <ChevronRight className="w-8 h-8"/>
            </button>

            {/* Current Image */}
            <div className="relative w-full h-full aspect-[16/9] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
              {modalData.images[modalData.index] ? (
                 <img 
                    key={modalData.images[modalData.index]} // Reset key to trigger entry animation
                    src={modalData.images[modalData.index]!} 
                    alt="Snapshot detail" 
                    className="w-full h-full object-contain" 
                  />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <Camera className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-bold">Этот кадр еще не готов...</p>
                </div>
              )}
              
              <div className="absolute top-4 left-6 px-4 py-2 bg-black/60 text-white/90 text-sm font-bold rounded-2xl backdrop-blur-md border border-white/10">
                Кадр: {modalData.index * 5} сек
              </div>
            </div>

            {/* Thumbnails Indicator */}
            <div className="absolute bottom-[-50px] flex gap-3">
              {modalData.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full transition-all border border-white/20 ${i === modalData.index ? 'bg-brand-blue dark:bg-brand-yellow w-8' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
