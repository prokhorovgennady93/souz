"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MonitoringGallery from "./MonitoringGallery";

interface BranchGroupProps {
  name: string;
  audits: any[];
}

export default function BranchGroup({ name, audits }: BranchGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-6">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-4">
           <div className={`h-8 w-1.5 rounded-full transition-colors ${isExpanded ? 'bg-brand-blue dark:bg-brand-yellow' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
           <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{name}</h2>
           <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-wider">
              Событий: {audits.length}
           </span>
        </div>
        
        <div className="text-zinc-400">
           {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <MonitoringGallery audits={audits} />
        </div>
      )}
    </div>
  );
}
