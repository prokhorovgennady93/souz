import { db } from "../src/lib/db";
import * as XLSX from "xlsx";
import path from "path";

async function exportToExcel() {
  const branches = await db.branch.findMany({
    orderBy: { name: 'asc' }
  });

  const data = branches.map(b => ({
    "ID (Технический)": b.id,
    "Название филиала": b.name,
    "RTSP ссылка (для видео)": b.rtspUrl || "",
    "Белый IP адрес": b.expectedIp || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Филиалы");

  // Настройка ширины колонок
  const wscols = [
    { wch: 30 }, // ID
    { wch: 40 }, // Название
    { wch: 60 }, // RTSP
    { wch: 20 }, // IP
  ];
  worksheet["!cols"] = wscols;

  const fileName = "branches_for_sysadmin.xlsx";
  const filePath = path.resolve(process.cwd(), fileName);
  
  XLSX.writeFile(workbook, filePath);
  
  console.log(`✅ Файл успешно создан: ${filePath}`);
}

exportToExcel()
  .catch(console.error)
  .finally(() => db.$disconnect());
