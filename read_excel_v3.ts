import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('./branches_for_sysadmin.xlsx');
console.log('Sheet names:', workbook.SheetNames);

for (const name of workbook.SheetNames) {
  const worksheet = workbook.Sheets[name];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const rowsWithData = data.filter((row: any) => row[2] || row[3]);
  console.log(`Sheet "${name}" rows: ${data.length}, rows with data: ${rowsWithData.length}`);
}
