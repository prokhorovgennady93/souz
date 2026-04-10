import { Metadata } from "next";
import { format, subDays } from "date-fns";
import NewsControlClient from "./NewsControlClient";
import { getNewsReports } from "@/app/actions/news_reports";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Аудит новостей | Панель управления",
};

export default async function NewsReportsPage() {
  const defaultFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const defaultTo = format(new Date(), "yyyy-MM-dd");
  const defaultQuery = "";

  const res = await getNewsReports(defaultFrom, defaultTo, defaultQuery);
  const initialReports = res.reports || [];

  return (
    <div className="p-4 md:p-8">
      <NewsControlClient 
        initialReports={initialReports}
        initialFrom={defaultFrom}
        initialTo={defaultTo}
        initialQuery={defaultQuery}
      />
    </div>
  );
}
