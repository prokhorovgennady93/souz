import { db } from "@/lib/db";
import { getTaskReports } from "@/app/actions/task_reports";
import TaskControlClient from "./TaskControlClient";

export const dynamic = "force-dynamic";

export default async function TaskReportsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ from?: string, to?: string, q?: string }> 
}) {
  const params = await searchParams;
  const todayStr = new Date().toISOString().split("T")[0];
  
  const from = params.from || todayStr;
  const to = params.to || todayStr;
  const query = params.q || "";

  // Изначальная загрузка данных на сервере за период
  const { reports } = await getTaskReports(from, to, query);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <TaskControlClient 
        initialReports={reports || []} 
        initialFrom={from}
        initialTo={to}
        initialQuery={query}
      />
    </div>
  );
}

