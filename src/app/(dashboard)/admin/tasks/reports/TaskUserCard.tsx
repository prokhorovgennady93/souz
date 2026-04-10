"use client";

import { UserCircle, Camera, ClipboardCheck, AlertTriangle, Paperclip } from "lucide-react";

export default function TaskUserCard({ 
  userStatus, 
  onClick 
}: { 
  userStatus: any, 
  onClick: () => void 
}) {
  const { user, status, completion } = userStatus;
  
  // Ищем первое фото или файл для превью
  const fileResponse = completion?.responses.find((r: any) => r.imageUrl);
  const fileUrl = fileResponse?.imageUrl;
  const isImage = fileUrl && (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.webp'));

  return (
    <div 
      onClick={onClick}
      className={`group relative aspect-[4/5] rounded-[2rem] overflow-hidden border transition-all cursor-pointer shadow-sm hover:shadow-xl hover:translate-y-[-4px] active:scale-95 ${
        status === 'COMPLETED' 
          ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' 
          : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
      }`}
    >
      {status === 'COMPLETED' ? (
        fileUrl ? (
           <>
             {isImage ? (
               <img src={fileUrl} alt={user.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             ) : (
               <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center p-6 text-center">
                  <Paperclip className="w-12 h-12 text-zinc-400 mb-2" />
                  <p className="text-[10px] font-black uppercase text-zinc-500">ФАЙЛ</p>
               </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
           </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-zinc-50 dark:bg-zinc-800/50">
             <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                <ClipboardCheck className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">ВЫПОЛНЕНО</p>
             <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold italic line-clamp-2">
               {completion?.responses.map((r: any) => r.value).filter(Boolean).join(", ") || "Без текста"}
             </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-pulse">
           <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-500 rounded-2xl flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
           </div>
           <h3 className="text-sm font-black text-red-500 leading-tight tracking-wider uppercase italic">НЕ ВЫПОЛНЕНО</h3>
        </div>
      )}

      {/* User Info Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all ${status === 'COMPLETED' && fileUrl ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
         <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${status === 'COMPLETED' && fileUrl ? 'bg-white/10 backdrop-blur-md' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
               <UserCircle className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
               <p className="text-[10px] font-black uppercase tracking-tighter truncate">{user.fullName}</p>
               <p className="text-[9px] opacity-70 font-medium truncate uppercase">{user.branchName}</p>
            </div>
         </div>
      </div>
      
      {/* Icon Indicator Top Right */}
      <div className="absolute top-4 right-4">
         {status === 'COMPLETED' ? (
           <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg">
             <ClipboardCheck className="w-3 h-3" />
           </div>
         ) : (
           <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg">
             <AlertTriangle className="w-3 h-3" />
           </div>
         )}
      </div>
    </div>
  );
}
