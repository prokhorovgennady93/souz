import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('./branches_for_sysadmin.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

for (let i = 0; i < data.length; i++) {
  console.log(`Row ${i}:`, JSON.stringify(data[i]));
}
