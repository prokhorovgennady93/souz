import { getCurrentShift } from "@/app/actions/shift";
import { getPublicBranches } from "@/app/actions/branch";
import { getUnfinishedTasksSummary } from "@/app/actions/task";
import ShiftControl from "./ShiftControl";
import { auth } from "../../../../auth";
import { db } from "@/lib/db";

export default async function BranchPage() {
  const session = await auth();
  const userName = session?.user?.name || "Сотрудник";

  const [{ shift }, { branches }, tasksSummary] = await Promise.all([
    getCurrentShift(),
    getPublicBranches(),
    getUnfinishedTasksSummary()
  ]);
  
  // Fetch latest user status from DB to avoid session lag
  const user = await db.user.findUnique({ where: { id: session?.user?.id } });
  const branchId = user?.branchId;
  const isOffDay = user?.isOffDay || false;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-sans text-brand-blue dark:text-brand-yellow">Управление сменой</h1>
      <ShiftControl 
        initialShift={shift} 
        userName={userName} 
        hasBranch={!!branchId} 
        isOffDay={isOffDay}
        allBranches={branches || []} 
        todayTasksSummary={tasksSummary}
      />
    </div>
  );
}
