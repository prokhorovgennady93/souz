import { getPenaltySummary } from "@/app/actions/penalty";
import { getMyTasks } from "@/app/actions/task";
import { getCompanyNews } from "@/app/actions/news";
import { AlertCircle } from "lucide-react";
import { auth } from "../../../../auth";
import TasksDashboard from "./TasksDashboard";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await auth();
  const [tasks, news, penalty] = await Promise.all([
    getMyTasks(),
    getCompanyNews(),
    getPenaltySummary()
  ]);


  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">Рабочий центр</h1>
        <p className="text-zinc-500 mt-2 font-medium">Задачи на сегодня и важные обновления компании</p>
      </div>

      <TasksDashboard 
        initialTasks={tasks} 
        initialNews={news} 
        role={(session?.user as any)?.role} 
        penaltyTotal={penalty.total}
      />


    </div>
  );
}
