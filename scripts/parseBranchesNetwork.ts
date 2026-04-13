import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const db = new PrismaClient();

async function main() {
  const workbook = xlsx.readFile('./branches_for_sysadmin.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // skip header
  const rows = data.slice(1);
  let updated = 0;

  for (const row of rows) {
    const [id, name, rtspUrl, expectedIp] = row as any[];
    if (id) {
      // Check if branch exists
      const branch = await db.branch.findUnique({ where: { id: String(id) } });
      if (branch) {
        await db.branch.update({
          where: { id: String(id) },
          data: {
            rtspUrl: rtspUrl ? String(rtspUrl) : null,
            expectedIp: expectedIp ? String(expectedIp) : null,
          }
        });
        updated++;
      } else {
        console.warn(`Branch with ID ${id} (${name}) not found.`);
      }
    }
  }
  console.log(`Updated ${updated} branches.`);
}

main().catch(console.error).finally(() => db.$disconnect());
