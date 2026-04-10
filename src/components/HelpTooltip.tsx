"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export function HelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center gap-1.5 relative -ml-8 sm:ml-0"
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">Скачать</span>
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none touch-manipulation p-0.5 -m-0.5"
        aria-label="Справка по скачиванию"
      >
        <HelpCircle className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-yellow-500' : 'text-zinc-300'}`} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-zinc-900 border border-white/10 text-white text-[11px] font-medium leading-relaxed rounded-2xl z-50 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none sm:pointer-events-auto">
          <div className="font-black text-yellow-500 mb-1 uppercase tracking-tighter text-[10px]">Инфо о загрузке</div>
          При нажатии скачивается конкретная тема. Для доступа ко всему курсу нажмите «Скачать весь курс» внизу страницы или на главной.
        </div>
      )}
    </div>
  );
}
