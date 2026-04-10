"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Search } from "lucide-react";
import { getPublicSchedule, PublicScheduleItem } from "../actions/publicSchedule";

export default function ScheduleClient() {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<PublicScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await getPublicSchedule(date);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch schedule", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [date]);

  const getStatusColor = (type: string) => {
    switch (type) {
      case "open":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "break":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "closed":
      default:
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    }
  };

  const getStatusIndicatorColor = (type: string) => {
    switch (type) {
      case "open":
        return "bg-emerald-500";
      case "break":
        return "bg-amber-500";
      case "closed":
      default:
        return "bg-rose-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/80 font-sans text-slate-900 dark:text-slate-100 flex flex-col pt-0">
       <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm shrink-0">
        <div className="w-full px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                График работы
              </h1>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-sm rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block pl-8 pr-2 py-1 outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-800 relative z-20 appearance-none h-[30px] shadow-sm cursor-pointer"
                style={{ colorScheme: "dark light" }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden flex flex-col w-full p-0">
        <div className="bg-white dark:bg-slate-900 border-y sm:border sm:rounded-none lg:border-t-0 border-slate-200 dark:border-slate-800 shadow-sm relative flex-1 flex flex-col overflow-hidden">
          
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
          )}

          <div className="overflow-x-auto flex-1 h-full">
            <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800/90 shadow-sm backdrop-blur-md w-full">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <th className="py-1.5 px-3 font-semibold tracking-wide text-[13px]">Филиал</th>
                  <th className="py-1.5 px-3 font-semibold tracking-wide text-[13px] w-[20%]">Сотрудник</th>
                  <th className="py-1.5 px-3 font-semibold tracking-wide text-[13px]">Телефон</th>
                  <th className="py-1.5 px-3 font-semibold tracking-wide text-[13px] text-center">График</th>
                  <th className="py-1.5 px-3 font-semibold tracking-wide text-[13px] text-center">Перерыв</th>
                  <th className="py-1.5 px-3 font-semibold tracking-wide text-[13px] text-right w-[20%]">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 w-full">
                {!isLoading && data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-full">
                      <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                        <Search className="w-6 h-6 mb-2" />
                        <p className="text-sm">Нет данных на выбранную дату</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr 
                      key={item.id} 
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150"
                    >
                      {/* Tightened cells (py-1) but larger text (text-sm mostly) */}
                      <td className="py-1.5 px-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                            {item.branchName}
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 px-3 text-slate-800 dark:text-slate-200 font-medium truncate max-w-[180px]">
                        {item.employeeName}
                      </td>
                      <td className="py-1.5 px-3 text-slate-700 dark:text-slate-300 font-mono text-sm">
                        {item.employeePhone}
                      </td>
                      <td className="py-1.5 px-3 text-slate-800 dark:text-slate-200 font-medium text-center font-mono text-[13px]">
                        {item.workSchedule}
                      </td>
                      <td className="py-1.5 px-3 text-slate-700 dark:text-slate-300 text-center font-mono text-[13px]">
                        {item.breakSchedule}
                      </td>
                      <td className="py-1 px-3 text-right">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(item.statusType)} shadow-sm`}>
                          {item.statusType === 'open' ? (
                            <span className="flex h-2 w-2 relative mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          ) : (
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusIndicatorColor(item.statusType)}`} />
                          )}
                          {item.status}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
