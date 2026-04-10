import { db } from "@/lib/db";
import { Camera } from "lucide-react";
import BranchGroup from "./BranchGroup";

export const dynamic = "force-dynamic";

export default async function MonitoringPage({ searchParams }: { searchParams: Promise<{ date?: string, branch?: string }> }) {
  const params = await searchParams;
  const dateStr = params.date || new Date().toISOString().split("T")[0];
  const startOfDay = new Date(dateStr);
  const endOfDay = new Date(dateStr);
  endOfDay.setHours(23, 59, 59, 999);

  // Получаем все аудиты за день
  const allAudits = await db.shiftAudit.findMany({
    where: {
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
      shift: params.branch ? { branchId: params.branch } : undefined,
    },
    include: {
      shift: {
        include: {
          user: true,
          branch: true,
        }
      }
    },
    orderBy: { timestamp: "desc" }
  });

  const branches = await db.branch.findMany({ orderBy: { name: "asc" } });

  // Группируем аудиты по филиалам
  const groupedByBranch: Record<string, { name: string, audits: any[] }> = {};
  
  allAudits.forEach(audit => {
    const branchId = audit.shift.branchId;
    const branchName = audit.shift.branch.name;
    
    if (!groupedByBranch[branchId]) {
      groupedByBranch[branchId] = { name: branchName, audits: [] };
    }
    groupedByBranch[branchId].audits.push(audit);
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-sans text-brand-blue dark:text-brand-yellow">Контроль работы филиалов</h1>
        
        <div className="flex items-center gap-3">
          <form className="flex gap-2">
            <input type="date" name="date" defaultValue={dateStr} className="p-2 border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm" />
            <select name="branch" defaultValue={params.branch || ""} className="p-2 border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm">
              <option value="">Все филиалы</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <button type="submit" className="p-2 bg-brand-blue text-brand-yellow rounded-lg text-sm font-bold shadow-sm hover:translate-y-[-1px] transition-transform active:translate-y-[0]">Найти</button>
          </form>
        </div>
      </div>

      {allAudits.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-20 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 shadow-sm transition-all animate-in fade-in zoom-in duration-500">
           <Camera className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
           <p className="text-zinc-500 font-medium font-sans italic">За выбранную дату событий не найдено.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedByBranch).map(([branchId, group]) => (
            <BranchGroup key={branchId} name={group.name} audits={group.audits} />
          ))}
        </div>
      )}
    </div>
  );
}
