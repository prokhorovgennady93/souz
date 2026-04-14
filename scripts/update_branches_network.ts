import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const db = new PrismaClient();

async function main() {
  const filePath = 'C:/Users/автошкола/.gemini/antigravity/brain/46f937b8-666e-4159-98e7-e944e1d02c5b/camera_report.xlsx';
  
  console.log(`Reading file: ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet) as any[];

  console.log(`Found ${data.length} rows in report.`);
  
  const branches = await db.branch.findMany();
  let updatedCount = 0;

  for (const row of data) {
    const dbName = row['Название (БД)'];
    const textName = row['Название (из текста)'];
    const rtspUrl = row['RTSP ссылка'];
    const ipAddr = row['IP адрес'];

    if (!rtspUrl || rtspUrl === 'Нет данных' || rtspUrl === '-') continue;

    // Try to find by exact name then partial name
    let targetBranch: any = branches.find((b: any) => b.name === dbName);
    
    if (!targetBranch && textName && textName !== '-') {
      targetBranch = branches.find((b: any) => b.name.toLowerCase().includes(textName.toLowerCase()));
    }

    if (targetBranch) {
      console.log(`Updating branch: ${targetBranch.name} | IP: ${ipAddr} | RTSP: ${rtspUrl.substring(0, 30)}...`);
      await db.branch.update({
        where: { id: targetBranch.id },
        data: {
          expectedIp: ipAddr && ipAddr !== '-' ? String(ipAddr) : null,
          rtspUrl: String(rtspUrl)
        }
      });
      updatedCount++;
    } else {
      console.warn(`Could not match branch from report: ${dbName} / ${textName}`);
    }
  }

  console.log(`\nSuccess! Updated ${updatedCount} branches.`);
}

main().catch(console.error).finally(() => db.$disconnect());
