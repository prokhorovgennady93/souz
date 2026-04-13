import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('./branches_for_sysadmin.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Get headers
const range = xlsx.utils.decode_range(sheet['!ref']!);
const headers = [];
for (let C = range.s.c; C <= range.e.c; ++C) {
  const cell = sheet[xlsx.utils.encode_cell({ r: range.s.r, c: C })];
  headers.push(cell ? cell.v : `Empty_${C}`);
}

console.log('Headers:', headers);

const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log('Row 2 (first branch):', data[1]);
console.log('Row 16 (branch with rtsp):', data[15]);
