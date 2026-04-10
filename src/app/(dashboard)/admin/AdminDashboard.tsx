"use client";

import { 
  UserCircle, Building2, AlertCircle, ListPlus, Megaphone, 
  Camera, ClipboardList, CheckCircle2, History 
} from "lucide-react";

/**
 * КНОПКА ДЛЯ АДМИН-ПАНЕЛИ В КОРПОРАТИВНОМ СТИЛЕ
 */
function AdminButton({ href, icon: Icon, title, desc }: any) {
  return (
    <a 
      href={href} 
      className="flex items-start gap-4 p-6 rounded-3xl bg-brand-blue border border-brand-yellow/10 transition-all duration-300 group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-brand-blue/40 active:scale-95 shadow-lg"
    >
       <div className="p-4 bg-brand-yellow/10 rounded-2xl text-brand-yellow group-hover:rotate-6 group-hover:scale-110 transition-all shrink-0">
          <Icon className="w-6 h-6" />
       </div>
       <div className="mt-0.5 overflow-hidden">
          <h4 className="font-black uppercase tracking-tight text-sm mb-1 truncate whitespace-normal text-brand-yellow group-hover:translate-x-1 transition-transform">{title}</h4>
          <p className="text-xs font-bold text-white/70 leading-snug line-clamp-2">{desc}</p>
       </div>
    </a>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ROW 1: Settings */}
      <div className="space-y-6">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-brand-yellow rounded-full"></div>
            Настройки системы
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminButton href="/admin/users" icon={UserCircle} title="Сотрудники" desc="Управление персоналом и ролями" />
            <AdminButton href="/admin/branches" icon={Building2} title="Филиалы" desc="Настройка филиалов и доступа" />
            <AdminButton href="/admin/penalties" icon={AlertCircle} title="Журнал штрафов" desc="Контроль санкций за нарушения" />
         </div>
      </div>

      {/* ROW 2: Task Work */}
      <div className="space-y-6">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-brand-yellow rounded-full"></div>
            Работа с задачами и информацией
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminButton href="/admin/tasks" icon={ListPlus} title="Поставить задачу" desc="Создание разовых или регулярных задач" />
            <AdminButton href="/admin/news" icon={Megaphone} title="Добавить новость" desc="Рассылка уведомлений сотрудниками" />
         </div>
      </div>

      {/* ROW 3: Reports */}
      <div className="space-y-6">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-brand-yellow rounded-full"></div>
            Аналитика и Отчёты
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminButton href="/admin/monitoring" icon={Camera} title="Мониторинг" desc="Онлайн-трансляции и скриншоты" />
            <AdminButton href="/admin/tasks/reports" icon={ClipboardList} title="Выполнение задач" desc="Просмотр результатов и фотоотчетов" />
            <AdminButton href="/admin/news/reports" icon={CheckCircle2} title="Отчёт по новостям" desc="Кто и когда прочитал объявления" />
            <AdminButton href="/admin/reports/work" icon={History} title="Отчёт по работе" desc="Анализ опозданий и перерывов" />
         </div>
      </div>

    </div>
  );
}
