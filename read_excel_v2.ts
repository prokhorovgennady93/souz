import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('./branches_for_sysadmin.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

// Filter out rows where both RTSP and IP are empty
const rowsWithData = data.filter((row: any) => row[2] || row[3]);

console.log(`Total rows: ${data.length}`);
console.log(`Rows with data: ${rowsWithData.length}`);
console.log('Samples with data:');
console.log(JSON.stringify(rowsWithData.slice(0, 5), null, 2));
